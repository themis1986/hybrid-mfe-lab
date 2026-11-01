<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { AccordionHeader, AccordionTrigger } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { TIcon } from '../TIcon'
import {
  tAccordionChevronClasses,
  tAccordionHeaderClasses,
  tAccordionTriggerClasses,
} from './TAccordion.variants'
import type { TAccordionTriggerProps } from './types'

// The trigger sits in the item's heading (an <h3>), followed by a chevron that turns when open.
defineOptions({ inheritAttrs: false })
defineProps<TAccordionTriggerProps>()
const root = useRootAttrs(() => tAccordionTriggerClasses)
</script>

<template>
  <AccordionHeader :class="tAccordionHeaderClasses">
    <AccordionTrigger
      data-slot="accordion-trigger"
      v-bind="root()"
      :as="as"
      :as-child="asChild"
    >
      <slot />
      <TIcon :icon="ChevronDown" :class="tAccordionChevronClasses" />
    </AccordionTrigger>
  </AccordionHeader>
</template>
