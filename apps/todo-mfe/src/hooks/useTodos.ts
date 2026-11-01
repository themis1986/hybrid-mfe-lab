import { storeToRefs } from 'pinia'
import { readonly } from 'vue'
import { useTodoStore } from '../stores/todos'
import type { TodoFilter } from '../types'

/**
 * The todo list for components: a readonly view of the store's state plus its actions. Components change
 * todos only through these actions, never by writing to the array.
 */
export function useTodos() {
  const store = useTodoStore()
  const refs = storeToRefs(store)
  const todos = readonly(refs.todos)

  function filtered(filter: TodoFilter) {
    if (filter === 'all') return todos.value
    return todos.value.filter((todo) => todo.done === (filter === 'done'))
  }

  return {
    todos,
    announcement: readonly(refs.announcement),
    openCount: refs.openCount,
    doneCount: refs.doneCount,
    filtered,
    add: store.add,
    update: store.update,
    toggle: store.toggle,
    remove: store.remove,
    clearCompleted: store.clearCompleted,
  }
}
