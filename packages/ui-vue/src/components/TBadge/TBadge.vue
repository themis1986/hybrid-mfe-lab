<script setup lang="ts">
import { useRootAttrs } from '../../lib/attrs'
import { tBadgeVariants } from './TBadge.variants'
import type { TBadgeProps } from './types'

// A short status or category label. The tone only reinforces the text, so the text must say it all.
defineOptions({ inheritAttrs: false })
const props = defineProps<TBadgeProps>()
const root = useRootAttrs(() =>
  tBadgeVariants({ tone: props.tone, size: props.size }),
)
</script>

<template>
  <span data-slot="badge" v-bind="root()">
    <slot>{{ label }}</slot>
  </span>
</template>
