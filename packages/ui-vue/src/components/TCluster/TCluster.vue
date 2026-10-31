<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tClusterVariants } from './TCluster.variants'
import type { TClusterProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TClusterProps>(), { as: 'div' })
const root = useRootAttrs(() => tClusterVariants({ gap: props.gap, align: props.align, justify: props.justify }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
