<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDialogTitleClasses } from './TDialog.variants'
import type { TDialogTitleProps } from './types'

defineOptions({ inheritAttrs: false })
defineProps<TDialogTitleProps>()
const root = useRootAttrs(() => tDialogTitleClasses)
</script>

<template>
  <DialogTitle v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </DialogTitle>
</template>
