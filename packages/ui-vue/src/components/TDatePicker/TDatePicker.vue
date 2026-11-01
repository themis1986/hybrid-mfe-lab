<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { Calendar } from '@lucide/vue'
import {
  DatePickerCalendar,
  DatePickerContent,
  DatePickerField,
  DatePickerInput,
  DatePickerRoot,
  DatePickerTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { parseIsoDate, toIsoDate, toMatcher } from '../../lib/date'
import { useDateModel } from '../../lib/dateModel'
import CalendarBody from '../TCalendar/CalendarBody.vue'
import { tCalendarRootClasses } from '../TCalendar/TCalendar.variants'
import {
  tDateFieldSegmentClasses,
  tDateFieldSegmentsClasses,
  tDateFieldTriggerClasses,
  tDateFieldVariants,
} from '../TDateField/TDateField.variants'
import { TIcon } from '../TIcon'
import { tDatePickerContentClasses } from './TDatePicker.variants'
import type { TDatePickerProps } from './types'

// A date field with a calendar button (Reka DatePicker): type the date as in TDateField, or open the calendar
// and pick it there (TCalendar's keys); Escape closes it. v-model is an ISO date ('2026-11-01'); v-model:open
// is the calendar's open state. The caller's attributes go on the field (role group).
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TDatePickerProps>(), {
  locale: 'en-US',
  numberOfMonths: 1,
  prevLabel: 'Previous month',
  nextLabel: 'Next month',
  closeOnSelect: true,
  triggerLabel: 'Open calendar',
})
const model = defineModel<string | undefined>({ default: undefined })
const open = defineModel<boolean | undefined>('open', { default: undefined })
const { draft, update } = useDateModel<string, DateValue | undefined>(
  model,
  props.defaultValue,
  (iso) => parseIsoDate(iso),
  (value: DateValue | undefined) => (value ? toIsoDate(value) : undefined),
)

const field = useRootAttrs(() => tDateFieldVariants({ size: props.size }))
const min = computed(() => parseIsoDate(props.min))
const max = computed(() => parseIsoDate(props.max))
const contentStyle = {
  '--t-popover-available-height': 'var(--reka-popover-content-available-height)',
  '--t-popover-transform-origin': 'var(--reka-popover-content-transform-origin)',
}
</script>

<template>
  <DatePickerRoot
    v-model:open="open"
    :default-open="defaultOpen"
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
    :name="name"
    :required="required"
    :close-on-select="closeOnSelect"
    weekday-format="short"
    @update:model-value="(value) => update(value as DateValue | undefined)"
  >
    <DatePickerField
      v-slot="{ segments }"
      data-slot="date-picker-field"
      v-bind="field()"
      :aria-invalid="invalid || undefined"
    >
      <div data-slot="date-field-segments" :class="tDateFieldSegmentsClasses">
        <DatePickerInput v-for="(item, i) in segments" :key="i" :part="item.part" :class="tDateFieldSegmentClasses">
          {{ item.value }}
        </DatePickerInput>
      </div>
      <DatePickerTrigger :aria-label="triggerLabel" :class="tDateFieldTriggerClasses">
        <TIcon :icon="Calendar" size="sm" />
      </DatePickerTrigger>
    </DatePickerField>
    <DatePickerContent
      data-slot="date-picker-content"
      side="bottom"
      align="start"
      :side-offset="4"
      :collision-padding="8"
      :class="tDatePickerContentClasses"
      :style="contentStyle"
    >
      <DatePickerCalendar v-slot="{ grid, weekDays }" :calendar-label="label" :class="tCalendarRootClasses">
        <CalendarBody :grid="grid" :week-days="weekDays" :prev-label="prevLabel" :next-label="nextLabel" />
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>
