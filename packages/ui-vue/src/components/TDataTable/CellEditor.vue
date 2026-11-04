<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { TDatePicker } from '../TDatePicker'
import { TInput } from '../TInput'
import { TSelect } from '../TSelect'
import { CellContent } from './CellContent'
import { useDataTableContext } from './context'
import { tDataTableEditorClasses } from './TDataTable.variants'
import type { TDataTableColumn } from './types'

// The editor of the cell being edited. One exists at a time, and its row stays mounted while it lasts.
const props = defineProps<{
  spec: TDataTableColumn<any>
  value: unknown
  row: unknown
  rowId: string
  columnId: string
}>()
const { labels, locale, slots, onCellEdit, finishEdit } = useDataTableContext()

const draft = ref(
  props.value === null || props.value === undefined ? '' : String(props.value),
)
const failed = ref(false)
let done = false

const commit = async (next: unknown, move?: 1 | -1) => {
  if (done) return
  done = true
  const unchanged = (next ?? '') === (props.value ?? '')
  if (!unchanged) {
    try {
      await onCellEdit()?.({
        rowId: props.rowId,
        row: props.row,
        columnId: props.columnId,
        value: next,
        previousValue: props.value,
      })
    } catch {
      // The editor stays open with its draft, marked as failed.
      done = false
      failed.value = true
      return
    }
  }
  finishEdit(move)
}
const cancel = () => {
  done = true
  finishEdit()
}

const editorSlot = computed(() => slots[`editor-${props.columnId}`])
const kind = computed(
  () =>
    props.spec.editor ??
    (props.spec.type === 'number' || props.spec.type === 'progress'
      ? 'number'
      : props.spec.type === 'date'
        ? 'date'
        : props.spec.editorOptions
          ? 'select'
          : 'text'),
)
const editLabel = computed(() => labels.value.editCell(props.spec.title))
const parse = () =>
  kind.value === 'number'
    ? draft.value === ''
      ? null
      : Number(draft.value)
    : draft.value

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    void commit(parse())
  } else if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    cancel()
  } else if (event.key === 'Tab') {
    event.preventDefault()
    void commit(parse(), event.shiftKey ? -1 : 1)
  }
}

const wrapper = useTemplateRef<HTMLElement>('wrapper')
onMounted(() => wrapper.value?.querySelector('input')?.focus())
</script>

<template>
  <CellContent
    v-if="editorSlot"
    :render="editorSlot"
    :context="{
      value,
      row,
      columnId,
      commit: (next: unknown) => void commit(next),
      cancel,
    }"
  />
  <TSelect
    v-else-if="kind === 'select'"
    size="sm"
    :aria-label="editLabel"
    :options="spec.editorOptions ?? []"
    :model-value="draft"
    :invalid="failed"
    :class="tDataTableEditorClasses"
    @update:model-value="
      (next) => {
        draft = next as string
        void commit(next)
      }
    "
  />
  <TDatePicker
    v-else-if="kind === 'date'"
    size="sm"
    :aria-label="editLabel"
    :locale="locale"
    :model-value="draft || undefined"
    :trigger-label="labels.openCalendar"
    :prev-label="labels.previousMonth"
    :next-label="labels.nextMonth"
    :invalid="failed"
    :class="tDataTableEditorClasses"
    @update:model-value="(next) => void commit(next ?? null)"
  />
  <span v-else ref="wrapper" :class="tDataTableEditorClasses">
    <TInput
      size="sm"
      :type="kind === 'number' ? 'number' : 'text'"
      :aria-label="editLabel"
      :model-value="draft"
      :invalid="failed"
      @update:model-value="draft = $event ?? ''"
      @blur="void commit(parse())"
      @keydown="onKeydown"
    />
  </span>
  <span v-if="failed" role="alert" class="sr-only">{{
    labels.editFailed
  }}</span>
</template>
