<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tAppShellSidebarClasses } from './TAppShell.variants'
import type { TAppShellSidebarProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TAppShellSidebarProps>(), { as: 'aside' })
const root = useRootAttrs(() => tAppShellSidebarClasses)
</script>

<template>
  <Primitive data-slot="app-shell-sidebar" v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
