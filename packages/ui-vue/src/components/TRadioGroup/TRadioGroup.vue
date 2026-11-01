<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tRadioGroupVariants } from './TRadioGroup.variants'
import type { TRadioGroupProps } from './types'

defineOptions({ inheritAttrs: false })
// A set of TRadioGroupItems. The group is only controlled when v-model is bound; otherwise `defaultValue`
// applies. Name the group with `aria-label` or `aria-labelledby`, and each item with a <label>.
const props = withDefaults(defineProps<TRadioGroupProps>(), { defaultValue: undefined })
const model = defineModel<string | undefined>({ default: undefined })
const root = useRootAttrs(() => tRadioGroupVariants({ orientation: props.orientation }))
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    data-slot="radio-group"
    v-bind="root()"
    :default-value="defaultValue"
    :orientation="orientation"
    :disabled="disabled"
    :name="name"
    :required="required"
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </RadioGroupRoot>
</template>
