<script setup lang="ts">
import { TButton, TCheckbox, TIcon } from '@repo/ui-vue'
import { Trash2 } from '@repo/ui-vue/icons'
import type { Todo } from '../types'
import TodoEditDialog from './TodoEditDialog.vue'

defineProps<{
  todo: Readonly<Todo>
  /** The checkbox's id: the list moves focus to it when a neighbour leaves. */
  checkboxId: string
}>()
const emit = defineEmits<{
  toggle: []
  update: [title: string]
  remove: []
}>()
</script>

<template>
  <li
    class="flex items-center gap-3 py-3 ps-4 pe-2 transition-colors duration-150 hover:bg-surface"
  >
    <TCheckbox
      :id="checkboxId"
      :model-value="todo.done"
      @update:model-value="emit('toggle')"
    />
    <!-- The label names the checkbox, and a click on the title toggles it too. -->
    <label
      :for="checkboxId"
      class="min-w-0 flex-1 cursor-pointer text-sm break-words transition-colors duration-150"
      :class="todo.done ? 'text-fg-muted line-through' : 'text-fg'"
    >
      {{ todo.title }}
    </label>
    <TodoEditDialog :title="todo.title" @save="emit('update', $event)" />
    <TButton
      variant="ghost"
      size="sm"
      class="w-8 px-0 text-fg-muted hover:text-danger-fg"
      :aria-label="`Remove “${todo.title}”`"
      @click="emit('remove')"
    >
      <TIcon :icon="Trash2" size="sm" />
    </TButton>
  </li>
</template>
