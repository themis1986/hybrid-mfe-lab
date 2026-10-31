<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tAppShellMainClasses } from './TAppShell.variants'
import type { TAppShellMainProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TAppShellMainProps>(), { as: 'main' })
const root = useRootAttrs(() => tAppShellMainClasses)
</script>

<template>
  <Primitive data-slot="app-shell-main" v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
