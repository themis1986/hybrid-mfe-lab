<script setup lang="ts">
import { DialogDescription } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDialogDescriptionClasses } from './TDialog.variants'
import type { TDialogDescriptionProps } from './types'

defineOptions({ inheritAttrs: false })
defineProps<TDialogDescriptionProps>()
const root = useRootAttrs(() => tDialogDescriptionClasses)
</script>

<template>
  <DialogDescription v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </DialogDescription>
</template>
