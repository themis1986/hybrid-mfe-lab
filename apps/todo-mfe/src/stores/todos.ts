import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { validateTitle } from '../hooks/validateTitle'
import type { Todo } from '../types'

// Pinia needs every state ref returned as is (not readonly) for its devtools and plugins. Components
// don't use this store directly: they go through useTodos(), which hands them a readonly view.
export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])

  const openCount = computed(() => todos.value.filter((todo) => !todo.done).length)
  const doneCount = computed(() => todos.value.length - openCount.value)

  function find(id: string) {
    return todos.value.find((todo) => todo.id === id)
  }

  /** Adds a todo at the top. Returns it, or undefined when the title is invalid. */
  function add(title: string): Todo | undefined {
    if (validateTitle(title)) return undefined
    const todo: Todo = { id: crypto.randomUUID(), title: title.trim(), done: false, createdAt: Date.now() }
    todos.value.unshift(todo)
    return todo
  }

  /** Renames a todo. Returns false when the todo is gone or the title is invalid. */
  function update(id: string, title: string): boolean {
    const todo = find(id)
    if (!todo || validateTitle(title)) return false
    todo.title = title.trim()
    return true
  }

  function toggle(id: string) {
    const todo = find(id)
    if (todo) todo.done = !todo.done
  }

  function remove(id: string) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  function clearCompleted() {
    todos.value = todos.value.filter((todo) => !todo.done)
  }

  return { todos, openCount, doneCount, add, update, toggle, remove, clearCompleted }
})
