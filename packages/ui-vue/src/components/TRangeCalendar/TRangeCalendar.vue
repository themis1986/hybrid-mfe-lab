<script setup lang="ts">
import { type DateRange, RangeCalendarRoot } from 'reka-ui'
import { computed } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { cn } from '../../lib/cn'
import { parseIsoDate, type TDateRange, toMatcher } from '../../lib/date'
import { rangeToIso, rangeToReka, useDateModel } from '../../lib/dateModel'
import { tCalendarFrameClasses, tCalendarRootClasses } from '../TCalendar/TCalendar.variants'
import RangeCalendarBody from './RangeCalendarBody.vue'
import RangePresets from './RangePresets.vue'
import type { TRangeCalendarProps } from './types'

// A month grid that picks a range of dates (Reka RangeCalendar): the first pick sets the start, the days up
// to the pointer or the focused day are previewed, the second pick sets the end (picks in either order).
// v-model is `{ start, end }` in ISO dates; it changes only once both ends are picked. Escape while picking
// returns to the last range. The keys are TCalendar's.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TRangeCalendarProps>(), {
  locale: 'en-US',
  numberOfMonths: 1,
  prevLabel: 'Previous month',
  nextLabel: 'Next month',
  presetsLabel: 'Presets',
})
const model = defineModel<TDateRange | undefined>({ default: undefined })
const { draft, update } = useDateModel(model, props.defaultValue, rangeToReka, rangeToIso)
// The complete range shown, for the presets (without a v-model, the model stays undefined).
const shown = computed(() => {
  const iso = rangeToIso(draft.value)
  return iso === 'skip' ? undefined : iso
})

const root = useRootAttrs(() => cn(tCalendarRootClasses, tCalendarFrameClasses))
const min = computed(() => parseIsoDate(props.min))
const max = computed(() => parseIsoDate(props.max))
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ grid, weekDays }"
    data-slot="calendar"
    v-bind="root()"
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
    :calendar-label="label"
    weekday-format="short"
    @update:model-value="(value) => update(value as DateRange)"
  >
    <RangePresets
      v-if="presets?.length"
      :presets="presets"
      :label="presetsLabel"
      :value="shown"
      :disabled="disabled || readonly"
      @select="(range) => update(rangeToReka(range))"
    />
    <RangeCalendarBody :grid="grid" :week-days="weekDays" :prev-label="prevLabel" :next-label="nextLabel" />
  </RangeCalendarRoot>
</template>
