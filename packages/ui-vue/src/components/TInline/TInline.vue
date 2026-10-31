<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tInlineVariants } from './TInline.variants'
import type { TInlineProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TInlineProps>(), { as: 'div' })
const root = useRootAttrs(() => tInlineVariants({ gap: props.gap, align: props.align, justify: props.justify, wrap: props.wrap }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
