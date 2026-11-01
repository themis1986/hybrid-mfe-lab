<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarRoot } from 'reka-ui'
import { computed } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { cn } from '../../lib/cn'
import { parseIsoDate, toIsoDate, toMatcher } from '../../lib/date'
import { useDateModel } from '../../lib/dateModel'
import CalendarBody from './CalendarBody.vue'
import {
  tCalendarFrameClasses,
  tCalendarRootClasses,
} from './TCalendar.variants'
import type { TCalendarProps } from './types'

// A month grid that picks one date (Reka Calendar). v-model is an ISO date ('2026-11-01'), undefined while
// none is picked. Arrow keys move by day and week, Page Up/Down by month (with Shift, by year), Home/End to
// the week's ends; Enter or Space picks.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TCalendarProps>(), {
  locale: 'en-US',
  numberOfMonths: 1,
  prevLabel: 'Previous month',
  nextLabel: 'Next month',
})
const model = defineModel<string | undefined>({ default: undefined })
const { draft, update } = useDateModel<string, DateValue | undefined>(
  model,
  props.defaultValue,
  (iso) => parseIsoDate(iso),
  (value: DateValue | undefined) => (value ? toIsoDate(value) : undefined),
)

const root = useRootAttrs(() => cn(tCalendarRootClasses, tCalendarFrameClasses))
const min = computed(() => parseIsoDate(props.min))
const max = computed(() => parseIsoDate(props.max))
</script>

<template>
  <CalendarRoot
    v-slot="{ grid, weekDays }"
    data-slot="calendar"
    v-bind="root()"
    :model-value="draft ?? null"
    :min-value="min"
    :max-value="max"
    :is-date-disabled="toMatcher(isDateDisabled)"
    :is-date-unavailable="toMatcher(isDateUnavailable)"
    :locale="locale"
    :week-starts-on="weekStartsOn"
    :number-of-months="numberOfMonths"
    :paged-navigation="pagedNavigation"
    :fixed-weeks="fixedWeeks"
    :disabled="disabled"
    :readonly="readonly"
    :calendar-label="label"
    weekday-format="short"
    @update:model-value="(value) => update(value as DateValue | undefined)"
  >
    <CalendarBody
      :grid="grid"
      :week-days="weekDays"
      :prev-label="prevLabel"
      :next-label="nextLabel"
    />
  </CalendarRoot>
</template>
