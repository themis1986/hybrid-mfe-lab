<script setup lang="ts">
import { DropdownMenuGroup } from 'reka-ui'
import type { TDropdownMenuGroupProps } from './types'

defineProps<TDropdownMenuGroupProps>()
</script>

<template>
  <DropdownMenuGroup
    data-slot="dropdown-menu-group"
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </DropdownMenuGroup>
</template>
