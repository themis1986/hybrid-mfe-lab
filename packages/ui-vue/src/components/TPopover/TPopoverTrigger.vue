<script setup lang="ts">
import { PopoverTrigger } from 'reka-ui'
import type { TPopoverTriggerProps } from './types'

// Wraps the button that opens it: <TPopoverTrigger as-child><TButton … /></TPopoverTrigger>.
defineProps<TPopoverTriggerProps>()
</script>

<template>
  <PopoverTrigger data-slot="popover-trigger" :as="as" :as-child="asChild">
    <slot />
  </PopoverTrigger>
</template>
