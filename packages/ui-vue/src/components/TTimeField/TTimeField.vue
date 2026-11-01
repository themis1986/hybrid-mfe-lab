<script setup lang="ts">
import { TimeFieldInput, TimeFieldRoot, type TimeValue } from 'reka-ui'
import { computed } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { parseIsoTime, toIsoTime } from '../../lib/date'
import { useDateModel } from '../../lib/dateModel'
import FormValue from '../TDateField/FormValue.vue'
import { tDateFieldSegmentClasses, tDateFieldSegmentsClasses, tDateFieldVariants } from '../TDateField/TDateField.variants'
import type { TTimeFieldProps } from './types'

// A time of day typed into segments (Reka TimeField), with TDateField's keys; A or P sets the AM/PM segment.
// v-model is an ISO time ('14:30', or '14:30:15' with granularity 'second'), undefined until every segment
// is filled. The caller's attributes go on the field (role group).
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TTimeFieldProps>(), { locale: 'en-US', granularity: 'minute' })
const model = defineModel<string | undefined>({ default: undefined })
const { draft, update } = useDateModel<string, TimeValue | undefined>(
  model,
  props.defaultValue,
  (iso) => parseIsoTime(iso),
  (value: TimeValue | undefined) => (value ? toIsoTime(value, props.granularity) : undefined),
)

const root = useRootAttrs(() => tDateFieldVariants({ size: props.size }))
const min = computed(() => parseIsoTime(props.min))
const max = computed(() => parseIsoTime(props.max))
const submitted = computed(() => (draft.value ? toIsoTime(draft.value, props.granularity) : ''))
</script>

<template>
  <TimeFieldRoot
    v-slot="{ segments }"
    data-slot="time-field"
    v-bind="root()"
    :model-value="draft ?? null"
    :min-value="min"
    :max-value="max"
    :granularity="granularity"
    :hour-cycle="hourCycle"
    :locale="locale"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="invalid || undefined"
    @update:model-value="(value) => update(value as TimeValue | undefined)"
  >
    <div data-slot="date-field-segments" :class="tDateFieldSegmentsClasses">
      <TimeFieldInput v-for="(item, i) in segments" :key="i" :part="item.part" :class="tDateFieldSegmentClasses">
        {{ item.value }}
      </TimeFieldInput>
    </div>
    <FormValue v-if="name !== undefined" :name="name" :value="submitted" :required="required" :disabled="disabled" />
  </TimeFieldRoot>
</template>
