<script setup lang="ts">
import { CollapsibleRoot } from 'reka-ui'
import type { TCollapsibleProps } from './types'

// A section that shows and hides its content (Reka Collapsible): v-model:open, or defaultOpen. The root
// and the trigger carry no styles: put a TButton in the trigger with `as-child`.
// The explicit undefined default keeps "not set" apart from "closed", so the section is only controlled
// when v-model:open is bound.
withDefaults(defineProps<TCollapsibleProps>(), { defaultOpen: undefined })
const open = defineModel<boolean | undefined>('open', { default: undefined })
</script>

<template>
  <CollapsibleRoot
    v-slot="slotProps"
    v-model:open="open"
    data-slot="collapsible"
    :default-open="defaultOpen"
    :disabled="disabled"
    :as="as"
    :as-child="asChild"
  >
    <slot v-bind="slotProps" />
  </CollapsibleRoot>
</template>
