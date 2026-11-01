import { defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { validateTitle } from '../helpers/validation.helpers'
import type { Todo } from '../types'

// Pinia needs every state ref returned as is (not readonly) for its devtools and plugins. Components
// don't use this store directly: they go through useTodos(), which hands them a readonly view.
export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  // What the page's one live region says; every action that changes a todo sets it.
  const announcement = ref('')

  const openCount = computed(() => todos.value.filter((todo) => !todo.done).length)
  const doneCount = computed(() => todos.value.length - openCount.value)

  function announce(text: string) {
    // Emptied first, so a repeated message is a change and gets read again.
    announcement.value = ''
    void nextTick(() => {
      announcement.value = text
    })
  }

  function find(id: string) {
    return todos.value.find((todo) => todo.id === id)
  }

  /** Adds a todo at the top. Returns it, or undefined when the title is invalid. */
  function add(title: string): Todo | undefined {
    if (validateTitle(title)) return undefined
    const todo: Todo = { id: crypto.randomUUID(), title: title.trim(), done: false, createdAt: Date.now() }
    todos.value.unshift(todo)
    announce(`Added “${todo.title}”.`)
    return todo
  }

  /** Renames a todo. Returns false when the todo is gone or the title is invalid. */
  function update(id: string, title: string): boolean {
    const todo = find(id)
    if (!todo || validateTitle(title)) return false
    todo.title = title.trim()
    announce(`Renamed to “${todo.title}”.`)
    return true
  }

  function toggle(id: string) {
    const todo = find(id)
    if (!todo) return
    todo.done = !todo.done
    announce(`“${todo.title}” marked as ${todo.done ? 'done' : 'open'}.`)
  }

  function remove(id: string) {
    const todo = find(id)
    if (!todo) return
    todos.value = todos.value.filter((item) => item.id !== id)
    announce(`Removed “${todo.title}”.`)
  }

  function clearCompleted() {
    const count = doneCount.value
    todos.value = todos.value.filter((todo) => !todo.done)
    announce(`Cleared ${count} done ${count === 1 ? 'todo' : 'todos'}.`)
  }

  return { todos, announcement, openCount, doneCount, add, update, toggle, remove, clearCompleted }
})
