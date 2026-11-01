<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDialogHeaderClasses } from './TDialog.variants'
import type { TDialogHeaderProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TDialogHeaderProps>(), { as: 'div' })
const root = useRootAttrs(() => tDialogHeaderClasses)
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
