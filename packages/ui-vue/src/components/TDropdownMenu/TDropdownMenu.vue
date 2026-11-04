<script setup lang="ts">
import { DropdownMenuRoot } from 'reka-ui'
import type { TDropdownMenuProps } from './types'

// A list of actions that opens from a button, with menu roles and arrow-key navigation (Reka Dropdown
// Menu). Non-modal by default: a modal menu blocks the page's pointer events and can leave them blocked
// when an item opens a dialog.
withDefaults(defineProps<TDropdownMenuProps>(), {
  defaultOpen: undefined,
  modal: false,
})
const open = defineModel<boolean | undefined>('open', { default: undefined })
</script>

<template>
  <DropdownMenuRoot
    v-slot="slotProps"
    v-model:open="open"
    :default-open="defaultOpen"
    :modal="modal"
  >
    <slot v-bind="slotProps" />
  </DropdownMenuRoot>
</template>
