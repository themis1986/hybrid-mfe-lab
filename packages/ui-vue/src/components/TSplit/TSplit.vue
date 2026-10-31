<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tSplitVariants } from './TSplit.variants'
import type { TSplitProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TSplitProps>(), { as: 'div' })
const root = useRootAttrs(() => tSplitVariants({ ratio: props.ratio, gap: props.gap }), () => ({ '--t-split-min': props.minPaneWidth }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
