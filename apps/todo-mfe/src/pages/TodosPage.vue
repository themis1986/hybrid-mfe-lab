<script setup lang="ts">
import {
  TButton,
  TCard,
  TIcon,
  TInline,
  TPageHeader,
  TStack,
  TTabs,
  TTabsContent,
  TTabsList,
  TTabsTrigger,
} from '@repo/ui-vue'
import { ArrowLeft } from '@repo/ui-vue/icons'
import { ref, useTemplateRef } from 'vue'
import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'
import { provideAnnouncer } from '../hooks/useAnnouncer'
import { useTodos } from '../hooks/useTodos'
import type { TodoFilter } from '../types'

const FILTERS: { value: TodoFilter; label: string; emptyTitle: string; emptyText: string }[] = [
  { value: 'all', label: 'All', emptyTitle: 'Nothing to do yet', emptyText: 'Add your first todo above.' },
  { value: 'open', label: 'Open', emptyTitle: 'All caught up', emptyText: 'Every todo is done. Nice work!' },
  { value: 'done', label: 'Done', emptyTitle: 'Nothing done yet', emptyText: 'Tick a todo to mark it as done.' },
]

const { openCount, doneCount, filtered, clearCompleted } = useTodos()
const { message, announce } = provideAnnouncer()

const filter = ref<TodoFilter>('all')
const form = useTemplateRef('form')

function onClearCompleted() {
  const count = doneCount.value
  clearCompleted()
  announce(`Cleared ${count} done ${count === 1 ? 'todo' : 'todos'}.`)
  // The button goes away with the done todos: focus would otherwise drop to the page.
  form.value?.focus()
}
</script>

<template>
  <TStack :gap="6">
    <TPageHeader title="Your todos" description="Add what needs doing, tick it off when it's done.">
      <template #actions>
        <TButton as-child variant="ghost" size="sm">
          <RouterLink to="/">
            <TIcon :icon="ArrowLeft" size="sm" />
            Home
          </RouterLink>
        </TButton>
      </template>
    </TPageHeader>

    <TCard variant="elevated" :padding="5">
      <TodoForm ref="form" />
    </TCard>

    <TTabs v-model="filter">
      <TInline wrap justify="between" :gap="3">
        <TTabsList variant="pills" aria-label="Show">
          <TTabsTrigger v-for="f in FILTERS" :key="f.value" :value="f.value">{{ f.label }}</TTabsTrigger>
        </TTabsList>
        <TInline :gap="2">
          <span class="text-sm text-fg-muted tabular-nums">{{ openCount }} open · {{ doneCount }} done</span>
          <TButton v-if="doneCount" variant="ghost" size="sm" label="Clear done" @click="onClearCompleted" />
        </TInline>
      </TInline>
      <TTabsContent v-for="f in FILTERS" :key="f.value" :value="f.value">
        <TodoList
          :todos="filtered(f.value)"
          :empty-title="f.emptyTitle"
          :empty-text="f.emptyText"
          @emptied="form?.focus()"
        />
      </TTabsContent>
    </TTabs>

    <!-- The one live region: the list and the form announce what they did through provideAnnouncer. -->
    <p class="sr-only" role="status">{{ message }}</p>
  </TStack>
</template>
