<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tSidebarLayoutVariants } from './TSidebarLayout.variants'
import type { TSidebarLayoutProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TSidebarLayoutProps>(), { as: 'div' })
const root = useRootAttrs(() => tSidebarLayoutVariants({ side: props.side, collapsed: props.collapsed, gap: props.gap }), () => ({ '--t-sidebar-width': props.sidebarWidth }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
