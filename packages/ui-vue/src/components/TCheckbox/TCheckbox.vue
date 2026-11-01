<script setup lang="ts">
import { Check, Minus } from '@lucide/vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { TIcon } from '../TIcon'
import {
  tCheckboxIconClasses,
  tCheckboxIndeterminateIconClasses,
  tCheckboxIndicatorClasses,
  tCheckboxVariants,
} from './TCheckbox.variants'
import type { TCheckboxProps } from './types'

defineOptions({ inheritAttrs: false })
// Vue casts an absent boolean prop to `false`. The explicit undefined defaults keep "not set" apart from
// "unchecked", so `defaultValue` applies and the checkbox is only controlled when v-model is bound.
const props = withDefaults(defineProps<TCheckboxProps>(), { defaultValue: undefined })
const model = defineModel<boolean | 'indeterminate' | undefined>({ default: undefined })
const root = useRootAttrs(() => tCheckboxVariants({ size: props.size }))
</script>

<template>
  <CheckboxRoot
    v-model="model"
    data-slot="checkbox"
    v-bind="root()"
    :default-value="defaultValue"
    :disabled="disabled"
    :name="name"
    :value="value"
    :required="required"
    :as="as"
    :as-child="asChild"
  >
    <CheckboxIndicator data-slot="checkbox-indicator" :class="tCheckboxIndicatorClasses">
      <TIcon :icon="Check" :class="tCheckboxIconClasses" />
      <TIcon :icon="Minus" :class="tCheckboxIndeterminateIconClasses" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
