<script setup lang="ts">
import {
  type DateRange,
  DateRangeFieldInput,
  DateRangeFieldRoot,
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
import FormValue from '../TDateField/FormValue.vue'
import {
  tDateFieldSegmentClasses,
  tDateFieldSegmentsClasses,
  tDateFieldSeparatorClasses,
  tDateFieldVariants,
} from '../TDateField/TDateField.variants'
import type { TDateRangeFieldProps } from './types'

// A range typed as two dates in one field (Reka DateRangeField), with TDateField's keys; Arrow Left/Right
// cross from the start date to the end date. v-model is `{ start, end }` in ISO dates; it changes only once
// both dates are complete. The form value is an ISO interval ('2026-11-01/2026-11-07'). The caller's
// attributes go on the field (role group).
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TDateRangeFieldProps>(), {
  locale: 'en-US',
})
const model = defineModel<TDateRange | undefined>({ default: undefined })
const { draft, update } = useDateModel(
  model,
  props.defaultValue,
  rangeToReka,
  rangeToIso,
)

const root = useRootAttrs(() => tDateFieldVariants({ size: props.size }))
const min = computed(() => parseIsoDate(props.min))
const max = computed(() => parseIsoDate(props.max))
const submitted = computed(() => {
  const iso = rangeToIso(draft.value)
  return rangeSubmitValue(iso === 'skip' ? undefined : iso)
})
</script>

<template>
  <DateRangeFieldRoot
    v-slot="{ segments }"
    data-slot="date-field"
    v-bind="root()"
    :model-value="draft"
    :min-value="min"
    :max-value="max"
    :is-date-unavailable="toMatcher(isDateUnavailable)"
    :locale="locale"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="invalid || undefined"
    @update:model-value="(value) => update(value as DateRange)"
  >
    <div data-slot="date-field-segments" :class="tDateFieldSegmentsClasses">
      <DateRangeFieldInput
        v-for="(item, i) in segments.start"
        :key="`start-${i}`"
        :part="item.part"
        type="start"
        :class="tDateFieldSegmentClasses"
      >
        {{ item.value }}
      </DateRangeFieldInput>
      <span aria-hidden="true" :class="tDateFieldSeparatorClasses">–</span>
      <DateRangeFieldInput
        v-for="(item, i) in segments.end"
        :key="`end-${i}`"
        :part="item.part"
        type="end"
        :class="tDateFieldSegmentClasses"
      >
        {{ item.value }}
      </DateRangeFieldInput>
    </div>
    <FormValue
      v-if="name !== undefined"
      :name="name"
      :value="submitted"
      :required="required"
      :disabled="disabled"
    />
  </DateRangeFieldRoot>
</template>
