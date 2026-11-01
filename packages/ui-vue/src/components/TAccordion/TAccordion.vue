<script setup lang="ts">
import { AccordionRoot } from 'reka-ui'
import type { TAccordionProps } from './types'

// Stacked sections that open one at a time (type="single", `collapsible` to allow closing the open one) or
// several at once (type="multiple") (Reka Accordion). Each TAccordionItem has a `value`.
// The explicit undefined default keeps "not set" apart from "none open", so Reka's own default applies and
// the accordion is only controlled when v-model is bound.
withDefaults(defineProps<TAccordionProps>(), { defaultValue: undefined })
const model = defineModel<string | string[] | undefined>({ default: undefined })
</script>

<template>
  <AccordionRoot
    v-slot="slotProps"
    v-model="model"
    data-slot="accordion"
    :type="type"
    :collapsible="collapsible"
    :default-value="defaultValue"
    :disabled="disabled"
    :as="as"
    :as-child="asChild"
  >
    <slot v-bind="slotProps" />
  </AccordionRoot>
</template>
