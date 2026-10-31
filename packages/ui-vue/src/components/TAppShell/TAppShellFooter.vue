<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tAppShellFooterClasses } from './TAppShell.variants'
import type { TAppShellFooterProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TAppShellFooterProps>(), { as: 'footer' })
const root = useRootAttrs(() => tAppShellFooterClasses)
</script>

<template>
  <Primitive data-slot="app-shell-footer" v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
