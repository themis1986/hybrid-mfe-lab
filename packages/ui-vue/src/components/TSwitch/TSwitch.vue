<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tSwitchThumbVariants, tSwitchVariants } from './TSwitch.variants'
import type { TSwitchProps } from './types'

defineOptions({ inheritAttrs: false })
// Vue casts an absent boolean prop to `false`. The explicit undefined defaults keep "not set" apart from
// "off", so `defaultValue` applies and the switch is only controlled when v-model is bound.
const props = withDefaults(defineProps<TSwitchProps>(), { defaultValue: undefined })
const model = defineModel<boolean | undefined>({ default: undefined })
const root = useRootAttrs(() => tSwitchVariants({ size: props.size }))
</script>

<template>
  <SwitchRoot
    v-model="model"
    data-slot="switch"
    v-bind="root()"
    :default-value="defaultValue"
    :disabled="disabled"
    :name="name"
    :value="value"
    :required="required"
    :as="as"
    :as-child="asChild"
  >
    <SwitchThumb data-slot="switch-thumb" :class="tSwitchThumbVariants({ size })" />
  </SwitchRoot>
</template>
