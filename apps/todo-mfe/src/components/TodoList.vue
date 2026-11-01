<script setup lang="ts">
import { TIcon } from '@repo/ui-vue'
import { ClipboardList } from '@repo/ui-vue/icons'
import { nextTick } from 'vue'
import { useTodos } from '../hooks/useTodos'
import type { Todo } from '../types'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
  todos: readonly Readonly<Todo>[]
  /** Shown when the list is empty. */
  emptyTitle: string
  emptyText: string
}>()
const emit = defineEmits<{
  /** The last item left the list while focus was in it: the page decides where focus goes. */
  emptied: []
}>()

const { toggle, update, remove } = useTodos()

function checkboxId(todo: Readonly<Todo>) {
  return `todo-${todo.id}-done`
}

// Runs an action that may take the item out of this list (removed, or toggled out of a filtered view).
// If it leaves, focus moves to the item that took its place, else to the one before it, so it is never
// stranded on a button that no longer exists.
async function keepFocus(id: string, action: () => void) {
  const index = props.todos.findIndex((todo) => todo.id === id)
  action()
  await nextTick()
  if (props.todos.some((todo) => todo.id === id)) return
  const neighbour = props.todos[index] ?? props.todos[index - 1]
  if (neighbour) document.getElementById(checkboxId(neighbour))?.focus()
  else emit('emptied')
}

function onToggle(todo: Readonly<Todo>) {
  void keepFocus(todo.id, () => toggle(todo.id))
}

function onUpdate(todo: Readonly<Todo>, title: string) {
  update(todo.id, title)
}

function onRemove(todo: Readonly<Todo>) {
  void keepFocus(todo.id, () => remove(todo.id))
}
</script>

<!-- A leaving row is taken out of the flow at once, so the rows below glide up (move-class) while it fades. -->
<template>
  <TransitionGroup
    v-if="todos.length"
    tag="ul"
    class="relative m-0 list-none divide-y divide-line overflow-hidden rounded-lg border border-line bg-canvas p-0 shadow-sm"
    enter-active-class="transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none"
    enter-from-class="-translate-y-1 opacity-0"
    leave-active-class="absolute inset-x-0 transition-opacity duration-150 ease-out motion-reduce:transition-none"
    leave-to-class="opacity-0"
    move-class="transition-transform duration-200 ease-out motion-reduce:transition-none"
  >
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      :checkbox-id="checkboxId(todo)"
      @toggle="onToggle(todo)"
      @update="onUpdate(todo, $event)"
      @remove="onRemove(todo)"
    />
  </TransitionGroup>
  <div
    v-else
    class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line px-6 py-10 text-center"
  >
    <TIcon :icon="ClipboardList" size="lg" class="text-fg-muted" />
    <p class="m-0 text-sm font-medium text-fg">{{ emptyTitle }}</p>
    <p class="m-0 text-sm text-fg-muted">{{ emptyText }}</p>
  </div>
</template>
