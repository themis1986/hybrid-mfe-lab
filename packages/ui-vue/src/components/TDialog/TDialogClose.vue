<script setup lang="ts">
import { DialogClose } from 'reka-ui'
import type { TDialogCloseProps } from './types'

defineProps<TDialogCloseProps>()
</script>

<template>
  <DialogClose :as="as" :as-child="asChild">
    <slot />
  </DialogClose>
</template>
