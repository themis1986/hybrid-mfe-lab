<script setup lang="ts">
import { AccordionItem } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tAccordionItemClasses } from './TAccordion.variants'
import type { TAccordionItemProps } from './types'

defineOptions({ inheritAttrs: false })
defineProps<TAccordionItemProps>()
const root = useRootAttrs(() => tAccordionItemClasses)
</script>

<template>
  <AccordionItem
    data-slot="accordion-item"
    v-bind="root()"
    :value="value"
    :disabled="disabled"
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </AccordionItem>
</template>
