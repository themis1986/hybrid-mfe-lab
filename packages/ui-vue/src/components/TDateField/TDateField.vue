<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { DateFieldInput, DateFieldRoot } from 'reka-ui'
import { computed } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { parseIsoDate, toIsoDate, toMatcher } from '../../lib/date'
import { useDateModel } from '../../lib/dateModel'
import { tDateFieldSegmentClasses, tDateFieldSegmentsClasses, tDateFieldVariants } from './TDateField.variants'
import type { TDateFieldProps } from './types'

// A date typed into segments (Reka DateField), in the locale's order: type digits (it moves on by itself),
// step a segment with Arrow Up/Down, move between them with Arrow Left/Right, clear one with Backspace.
// v-model is an ISO date ('2026-11-01'), undefined until every segment is filled. The caller's attributes
// go on the field (role group): name it with aria-label, or a <label for> pointing at its `id`.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TDateFieldProps>(), { locale: 'en-US' })
const model = defineModel<string | undefined>({ default: undefined })
const { draft, update } = useDateModel<string, DateValue | undefined>(
  model,
  props.defaultValue,
  (iso) => parseIsoDate(iso),
  (value: DateValue | undefined) => (value ? toIsoDate(value) : undefined),
)

const root = useRootAttrs(() => tDateFieldVariants({ size: props.size }))
const min = computed(() => parseIsoDate(props.min))
const max = computed(() => parseIsoDate(props.max))
</script>

<template>
  <DateFieldRoot
    v-slot="{ segments }"
    data-slot="date-field"
    v-bind="root()"
    :model-value="draft ?? null"
    :min-value="min"
    :max-value="max"
    :is-date-unavailable="toMatcher(isDateUnavailable)"
    :locale="locale"
    :disabled="disabled"
    :readonly="readonly"
    :name="name"
    :required="required"
    :aria-invalid="invalid || undefined"
    @update:model-value="(value) => update(value as DateValue | undefined)"
  >
    <div data-slot="date-field-segments" :class="tDateFieldSegmentsClasses">
      <DateFieldInput v-for="(item, i) in segments" :key="i" :part="item.part" :class="tDateFieldSegmentClasses">
        {{ item.value }}
      </DateFieldInput>
    </div>
  </DateFieldRoot>
</template>
