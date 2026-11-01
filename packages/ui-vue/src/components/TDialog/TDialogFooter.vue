<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDialogFooterClasses } from './TDialog.variants'
import type { TDialogFooterProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TDialogFooterProps>(), { as: 'div' })
const root = useRootAttrs(() => tDialogFooterClasses)
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
