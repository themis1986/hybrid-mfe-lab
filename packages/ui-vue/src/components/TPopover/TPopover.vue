<script setup lang="ts">
import { PopoverRoot } from 'reka-ui'
import type { TPopoverProps } from './types'

// A panel that opens from a trigger and holds any content: a few related fields, filters, a short form
// (Reka Popover): v-model:open, or defaultOpen. It is non-modal unless `modal`. Fields inside may open their
// own overlays (a TSelect's list): those count as inside, so they don't close it.
// The explicit undefined defaults keep "not set" apart from "off", so Reka's own defaults apply and the
// popover is only controlled when v-model:open is bound.
withDefaults(defineProps<TPopoverProps>(), {
  defaultOpen: undefined,
  modal: undefined,
})
const open = defineModel<boolean | undefined>('open', { default: undefined })
</script>

<template>
  <PopoverRoot
    v-slot="slotProps"
    v-model:open="open"
    :default-open="defaultOpen"
    :modal="modal"
  >
    <slot v-bind="slotProps" />
  </PopoverRoot>
</template>
