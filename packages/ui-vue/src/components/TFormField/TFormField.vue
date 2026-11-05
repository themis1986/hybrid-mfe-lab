<script setup lang="ts">
import { Label } from 'reka-ui'
import { computed, useId } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import {
  tFormFieldHintVariants,
  tFormFieldLabelClasses,
  tFormFieldRootClasses,
} from './TFormField.variants'
import type { TFormFieldControlProps, TFormFieldProps } from './types'

// A label and a hint around any control: what TField does for an input, for a select, a date picker, a
// radio group or a combobox. The default slot renders the control and receives the ids to wire.
defineOptions({ inheritAttrs: false })
const props = defineProps<TFormFieldProps>()
defineSlots<{ default(control: TFormFieldControlProps): unknown }>()

// useId() is unique within one Vue app. Several apps (microfrontends) on one page must each set their
// own app.config.idPrefix, or their ids can collide.
const generatedId = useId()
const controlId = computed(() => props.id ?? `t-form-field-${generatedId}`)
const labelId = computed(() => `${controlId.value}-label`)
const hintId = computed(() => `${controlId.value}-hint`)
const hint = computed(() => props.error ?? props.description)
const control = computed<TFormFieldControlProps>(() => ({
  id: controlId.value,
  labelId: labelId.value,
  describedBy: hint.value ? hintId.value : undefined,
  invalid: !!props.error,
}))
const root = useRootAttrs(() => tFormFieldRootClasses)
</script>

<template>
  <div v-bind="root()">
    <Label :id="labelId" :for="controlId" :class="tFormFieldLabelClasses">
      {{ label }}
    </Label>
    <slot v-bind="control" />
    <p
      v-if="hint"
      :id="hintId"
      :role="error ? 'alert' : undefined"
      :class="tFormFieldHintVariants({ tone: error ? 'error' : 'description' })"
    >
      {{ hint }}
    </p>
  </div>
</template>
