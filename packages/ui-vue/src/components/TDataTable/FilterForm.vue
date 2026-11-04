<script setup lang="ts">
import {
  isTableFilterEmpty,
  type TableColumnFilter,
  type TableDateRange,
  type TableNumberRange,
  toFilterOptions,
} from '@repo/table-core'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { TInput } from '../TInput'
import { TRangeDatePicker } from '../TRangeDatePicker'
import { TSelect } from '../TSelect'
import type { EngineColumn } from './context'
import { useDataTableContext } from './context'
import { tDataTableFilterRangeClasses } from './TDataTable.variants'

const TEXT_DELAY = 200

const props = defineProps<{
  column: EngineColumn
  filter: TableColumnFilter<any>
  title: string
}>()
const { labels, locale } = useDataTableContext()

const value = computed(() => props.column.getFilterValue())

// The facets are read once per opening of the panel, which mounts this.
const options = (() => {
  const { filter, column } = props
  if (filter.type !== 'select' && filter.type !== 'multiSelect') return []
  return (
    filter.options ?? toFilterOptions(column.getFacetedUniqueValues().keys())
  )
})()

const text = ref(typeof value.value === 'string' ? value.value : '')
let timer: ReturnType<typeof setTimeout> | undefined
watch(value, (next) => {
  text.value = typeof next === 'string' ? next : ''
})
const onText = (next: string | undefined) => {
  text.value = next ?? ''
  clearTimeout(timer)
  timer = setTimeout(
    () => props.column.setFilterValue(text.value || undefined),
    TEXT_DELAY,
  )
}
// The panel can close before the delay ends: what was typed still applies.
onBeforeUnmount(() => {
  clearTimeout(timer)
  if (props.filter.type === 'text' && text.value !== (value.value ?? '')) {
    props.column.setFilterValue(text.value || undefined)
  }
})

const numberRange = computed(() => (value.value ?? {}) as TableNumberRange)
const setRange = (part: 'min' | 'max', raw: string | undefined) => {
  const next: TableNumberRange = {
    ...numberRange.value,
    [part]: raw === '' || raw === undefined ? undefined : Number(raw),
  }
  props.column.setFilterValue(isTableFilterEmpty(next) ? undefined : next)
}

const dateRange = computed(() => {
  const range = value.value as TableDateRange | undefined
  return range?.start && range.end
    ? { start: range.start, end: range.end }
    : undefined
})
</script>

<template>
  <div
    v-if="filter.type === 'numberRange'"
    :class="tDataTableFilterRangeClasses"
  >
    <TInput
      type="number"
      size="sm"
      :aria-label="`${title}: ${labels.rangeMin}`"
      :placeholder="labels.rangeMin"
      :min="filter.min"
      :max="filter.max"
      :step="filter.step"
      :model-value="
        numberRange.min === undefined ? '' : String(numberRange.min)
      "
      @update:model-value="setRange('min', $event)"
    />
    <TInput
      type="number"
      size="sm"
      :aria-label="`${title}: ${labels.rangeMax}`"
      :placeholder="labels.rangeMax"
      :min="filter.min"
      :max="filter.max"
      :step="filter.step"
      :model-value="
        numberRange.max === undefined ? '' : String(numberRange.max)
      "
      @update:model-value="setRange('max', $event)"
    />
  </div>
  <TRangeDatePicker
    v-else-if="filter.type === 'dateRange'"
    size="sm"
    :aria-label="title"
    :locale="locale"
    :min="filter.min"
    :max="filter.max"
    :trigger-label="labels.openCalendar"
    :prev-label="labels.previousMonth"
    :next-label="labels.nextMonth"
    :model-value="dateRange"
    @update:model-value="column.setFilterValue($event)"
  />
  <TSelect
    v-else-if="filter.type === 'select'"
    size="sm"
    :aria-label="title"
    :options="options"
    :placeholder="labels.selectPlaceholder"
    :model-value="(value as string | undefined) ?? ''"
    @update:model-value="column.setFilterValue($event || undefined)"
  />
  <TSelect
    v-else-if="filter.type === 'multiSelect'"
    multiple
    size="sm"
    :aria-label="title"
    :options="options"
    :placeholder="labels.selectPlaceholder"
    :model-value="(value as string[] | undefined) ?? []"
    @update:model-value="
      column.setFilterValue(($event as string[])?.length ? $event : undefined)
    "
  />
  <TInput
    v-else
    size="sm"
    :aria-label="title"
    :placeholder="
      (filter as { placeholder?: string }).placeholder ?? labels.filter
    "
    :model-value="text"
    @update:model-value="onText"
  />
</template>
