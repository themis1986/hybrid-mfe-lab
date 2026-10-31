<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tSidebarLayoutContentClasses } from './TSidebarLayout.variants'
import type { TSidebarLayoutContentProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TSidebarLayoutContentProps>(), { as: 'div' })
const root = useRootAttrs(() => tSidebarLayoutContentClasses)
</script>

<template>
  <Primitive data-slot="sidebar-layout-content" v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
