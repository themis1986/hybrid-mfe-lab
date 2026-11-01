<script setup lang="ts">
import { PopoverClose } from 'reka-ui'
import type { TPopoverCloseProps } from './types'

defineProps<TPopoverCloseProps>()
</script>

<template>
  <PopoverClose data-slot="popover-close" :as="as" :as-child="asChild">
    <slot />
  </PopoverClose>
</template>
