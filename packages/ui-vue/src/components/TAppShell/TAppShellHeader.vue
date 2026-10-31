<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tAppShellHeaderClasses } from './TAppShell.variants'
import type { TAppShellHeaderProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TAppShellHeaderProps>(), { as: 'header' })
const root = useRootAttrs(() => tAppShellHeaderClasses)
</script>

<template>
  <Primitive data-slot="app-shell-header" v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
