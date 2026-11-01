<script setup lang="ts">
import { CollapsibleContent } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tCollapsibleContentClasses } from './TCollapsible.variants'
import type { TCollapsibleContentProps } from './types'

defineOptions({ inheritAttrs: false })
defineProps<TCollapsibleContentProps>()
const root = useRootAttrs(
  () => tCollapsibleContentClasses,
  () => ({
    '--t-collapsible-height': 'var(--reka-collapsible-content-height)',
  }),
)
</script>

<template>
  <CollapsibleContent
    data-slot="collapsible-content"
    v-bind="root()"
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </CollapsibleContent>
</template>
