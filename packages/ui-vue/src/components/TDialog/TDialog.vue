<script setup lang="ts">
import { DialogRoot } from 'reka-ui'
import type { TDialogProps } from './types'

// Vue casts an absent boolean prop to `false`. The explicit undefined defaults keep "not set" apart from
// "off", so Reka's own defaults apply (a modal, closed dialog) and the dialog is only controlled when
// v-model:open is bound. Give every dialog a TDialogTitle: it names the dialog for assistive technology.
withDefaults(defineProps<TDialogProps>(), { defaultOpen: undefined, modal: undefined })
const open = defineModel<boolean | undefined>('open', { default: undefined })
</script>

<template>
  <DialogRoot v-slot="slotProps" v-model:open="open" :default-open="defaultOpen" :modal="modal">
    <slot v-bind="slotProps" />
  </DialogRoot>
</template>
