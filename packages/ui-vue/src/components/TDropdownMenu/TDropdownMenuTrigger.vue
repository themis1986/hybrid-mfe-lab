<script setup lang="ts">
import { DropdownMenuTrigger } from 'reka-ui'
import type { TDropdownMenuTriggerProps } from './types'

// Wraps the button that opens it: <TDropdownMenuTrigger as-child><TButton … /></TDropdownMenuTrigger>.
defineProps<TDropdownMenuTriggerProps>()
</script>

<template>
  <DropdownMenuTrigger
    data-slot="dropdown-menu-trigger"
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
