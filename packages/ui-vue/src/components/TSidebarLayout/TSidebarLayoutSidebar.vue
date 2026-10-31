<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tSidebarLayoutSidebarClasses } from './TSidebarLayout.variants'
import type { TSidebarLayoutSidebarProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TSidebarLayoutSidebarProps>(), { as: 'aside' })
const root = useRootAttrs(() => tSidebarLayoutSidebarClasses)
</script>

<template>
  <Primitive data-slot="sidebar-layout-sidebar" v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
