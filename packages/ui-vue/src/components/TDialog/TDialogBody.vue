<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDialogBodyClasses } from './TDialog.variants'
import type { TDialogBodyProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TDialogBodyProps>(), { as: 'div' })
const root = useRootAttrs(() => tDialogBodyClasses)
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
