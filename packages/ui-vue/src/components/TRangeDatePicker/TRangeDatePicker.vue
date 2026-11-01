<script setup lang="ts">
import { Calendar } from '@lucide/vue'
import {
  type DateRange,
  DateRangePickerCalendar,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerInput,
  DateRangePickerRoot,
  DateRangePickerTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import {
  parseIsoDate,
  rangeSubmitValue,
  type TDateRange,
  toMatcher,
} from '../../lib/date'
import { rangeToIso, rangeToReka, useDateModel } from '../../lib/dateModel'
import { tCalendarRootClasses } from '../TCalendar/TCalendar.variants'
import FormValue from '../TDateField/FormValue.vue'
import {
  tDateFieldSegmentClasses,
  tDateFieldSegmentsClasses,
  tDateFieldSeparatorClasses,
  tDateFieldTriggerClasses,
  tDateFieldVariants,
} from '../TDateField/TDateField.variants'
import { tDatePickerContentClasses } from '../TDatePicker/TDatePicker.variants'
import { TIcon } from '../TIcon'
import RangeCalendarBody from '../TRangeCalendar/RangeCalendarBody.vue'
import RangePresets from '../TRangeCalendar/RangePresets.vue'
import type { TRangeDatePickerProps } from './types'

// A range field with a calendar button (Reka DateRangePicker): type both dates as in TDateRangeField, or open
// the calendar and pick the start and the end there (TRangeCalendar's behaviour), or pick a preset. v-model is
// `{ start, end }` in ISO dates and changes only once both ends are set; the form value is an ISO interval
// ('2026-11-01/2026-11-07'). The caller's attributes go on the field (role group).
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TRangeDatePickerProps>(), {
  locale: 'en-US',
  numberOfMonths: 1,
  prevLabel: 'Previous month',
  nextLabel: 'Next month',
  closeOnSelect: true,
  triggerLabel: 'Open calendar',
  presetsLabel: 'Presets',
})
const model = defineModel<TDateRange | undefined>({ default: undefined })
const open = defineModel<boolean | undefined>('open', { default: undefined })
const { draft, update } = useDateModel(
  model,
  props.defaultValue,
  rangeToReka,
  rangeToIso,
)
// The complete range shown, for the presets and the form (without a v-model, the model stays undefined).
const shown = computed(() => {
  const iso = rangeToIso(draft.value)
  return iso === 'skip' ? undefined : iso
})

const field = useRootAttrs(() => tDateFieldVariants({ size: props.size }))
const min = computed(() => parseIsoDate(props.min))
const max = computed(() => parseIsoDate(props.max))
const contentStyle = {
  '--t-popover-available-height':
    'var(--reka-popover-content-available-height)',
  '--t-popover-transform-origin':
    'var(--reka-popover-content-transform-origin)',
}
</script>

<template>
  <DateRangePickerRoot
    v-model:open="open"
    :default-open="defaultOpen"
    :model-value="draft"
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
    :close-on-select="closeOnSelect"
    weekday-format="short"
    @update:model-value="(value) => update(value as DateRange)"
  >
    <DateRangePickerField
      v-slot="{ segments }"
      data-slot="date-picker-field"
      v-bind="field()"
      :aria-invalid="invalid || undefined"
    >
      <div data-slot="date-field-segments" :class="tDateFieldSegmentsClasses">
        <DateRangePickerInput
          v-for="(item, i) in segments.start"
          :key="`start-${i}`"
          :part="item.part"
          type="start"
          :class="tDateFieldSegmentClasses"
        >
          {{ item.value }}
        </DateRangePickerInput>
        <span aria-hidden="true" :class="tDateFieldSeparatorClasses">–</span>
        <DateRangePickerInput
          v-for="(item, i) in segments.end"
          :key="`end-${i}`"
          :part="item.part"
          type="end"
          :class="tDateFieldSegmentClasses"
        >
          {{ item.value }}
        </DateRangePickerInput>
      </div>
      <DateRangePickerTrigger
        :aria-label="triggerLabel"
        :class="tDateFieldTriggerClasses"
      >
        <TIcon :icon="Calendar" size="sm" />
      </DateRangePickerTrigger>
      <FormValue
        v-if="name !== undefined"
        :name="name"
        :value="rangeSubmitValue(shown)"
        :required="required"
        :disabled="disabled"
      />
    </DateRangePickerField>
    <DateRangePickerContent
      data-slot="date-picker-content"
      side="bottom"
      align="start"
      :side-offset="4"
      :collision-padding="8"
      :class="tDatePickerContentClasses"
      :style="contentStyle"
    >
      <DateRangePickerCalendar
        v-slot="{ grid, weekDays }"
        :calendar-label="label"
        :class="tCalendarRootClasses"
      >
        <RangePresets
          v-if="presets?.length"
          :presets="presets"
          :label="presetsLabel"
          :value="shown"
          :disabled="disabled || readonly"
          @select="(range) => update(rangeToReka(range))"
        />
        <RangeCalendarBody
          :grid="grid"
          :week-days="weekDays"
          :prev-label="prevLabel"
          :next-label="nextLabel"
        />
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>
