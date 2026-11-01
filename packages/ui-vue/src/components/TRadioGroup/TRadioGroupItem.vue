<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tRadioIndicatorClasses, tRadioVariants } from './TRadioGroup.variants'
import type { TRadioGroupItemProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<TRadioGroupItemProps>()
const root = useRootAttrs(() => tRadioVariants({ size: props.size }))
</script>

<template>
  <RadioGroupItem
    data-slot="radio-group-item"
    v-bind="root()"
    :value="value"
    :disabled="disabled"
    :as="as"
    :as-child="asChild"
  >
    <RadioGroupIndicator
      data-slot="radio-group-indicator"
      :class="tRadioIndicatorClasses"
    />
  </RadioGroupItem>
</template>
