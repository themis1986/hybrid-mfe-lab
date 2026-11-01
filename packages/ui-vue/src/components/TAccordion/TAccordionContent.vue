<script setup lang="ts">
import { AccordionContent } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tCollapsibleContentClasses } from '../TCollapsible/TCollapsible.variants'
import { tAccordionContentInnerClasses } from './TAccordion.variants'
import type { TAccordionContentProps } from './types'

// Animates its height like TCollapsibleContent; the padding (and the caller's class) sit on an inner
// wrapper.
defineOptions({ inheritAttrs: false })
defineProps<TAccordionContentProps>()
const inner = useRootAttrs(() => tAccordionContentInnerClasses)
</script>

<template>
  <AccordionContent
    data-slot="accordion-content"
    :class="tCollapsibleContentClasses"
    :style="{
      '--t-collapsible-height': 'var(--reka-accordion-content-height)',
    }"
    :as="as"
    :as-child="asChild"
  >
    <div v-bind="inner()">
      <slot />
    </div>
  </AccordionContent>
</template>
