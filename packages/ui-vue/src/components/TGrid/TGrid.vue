<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tGridVariants } from './TGrid.variants'
import type { TGridProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TGridProps>(), { as: 'div' })
const root = useRootAttrs(() => tGridVariants({ cols: props.minChildWidth === undefined ? props.cols : null, auto: props.minChildWidth !== undefined, gap: props.gap }), () => ({ '--t-grid-min': props.minChildWidth }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
