<script setup lang="ts">
import { X } from '@lucide/vue'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tDialogCloseClasses,
  tDialogContentVariants,
  tDialogOverlayClasses,
} from './TDialog.variants'
import type { TDialogContentProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TDialogContentProps>(), {
  closeLabel: 'Close',
})
// The caller's attributes and listeners (@escape-key-down, @pointer-down-outside, …) go on Reka's content.
const root = useRootAttrs(() => tDialogContentVariants({ size: props.size }))
</script>

<!-- The close button comes last, so opening focuses the first control of the content instead. -->
<template>
  <DialogPortal>
    <DialogOverlay data-slot="dialog-overlay" :class="tDialogOverlayClasses" />
    <DialogContent data-slot="dialog-content" v-bind="root()" :as="as">
      <slot />
      <DialogClose v-if="!hideClose" as-child>
        <TButton
          variant="ghost"
          size="sm"
          :aria-label="closeLabel"
          :class="tDialogCloseClasses"
        >
          <TIcon :icon="X" size="sm" />
        </TButton>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
