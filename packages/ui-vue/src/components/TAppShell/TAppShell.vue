<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tAppShellVariants } from './TAppShell.variants'
import type { TAppShellProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TAppShellProps>(), { as: 'div', hasSidebar: true })
const root = useRootAttrs(() => tAppShellVariants({ collapsed: props.collapsed, hasSidebar: props.hasSidebar, viewport: props.viewport }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
