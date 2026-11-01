<script setup lang="ts">
import { X } from '@lucide/vue'
import { PopoverClose, PopoverContent, PopoverPortal } from 'reka-ui'
import { useAttrs, useId } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tPopoverCloseClasses,
  tPopoverContentVariants,
  tPopoverDescriptionClasses,
  tPopoverHeaderClasses,
  tPopoverTitleClasses,
} from './TPopover.variants'
import type { TPopoverContentProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TPopoverContentProps>(), {
  closeLabel: 'Close',
  side: 'bottom',
  align: 'start',
  sideOffset: 8,
})
// The caller's attributes and listeners (aria-label, @escape-key-down, …) go on Reka's content.
const root = useRootAttrs(
  () => tPopoverContentVariants({ size: props.size }),
  () => ({
    '--t-popover-available-height':
      'var(--reka-popover-content-available-height)',
    '--t-popover-transform-origin':
      'var(--reka-popover-content-transform-origin)',
  }),
)
// useId() is unique within one Vue app: each app on the page sets its own app.config.idPrefix.
const id = useId()
const attrs = useAttrs()

// Reka's PopoverContent names the dialog after its trigger (aria-labelledby = the trigger's id) and
// overrides a passed value. Once it opens (open-auto-focus fires on the positioning wrapper around the
// dialog), point the name at the title, or drop it so the caller's aria-label names it. Reka's value never
// changes, so Vue doesn't patch ours away.
function nameDialog(event: Event) {
  const target = event.target as HTMLElement
  const dialog = target.matches('[role=dialog]')
    ? target
    : target.querySelector<HTMLElement>('[role=dialog]')
  if (!dialog) return
  if (props.title) dialog.setAttribute('aria-labelledby', `${id}-title`)
  else if (attrs['aria-label']) dialog.removeAttribute('aria-labelledby')
}
</script>

<!-- The close button comes last, so opening focuses the first field of the content instead. -->
<template>
  <PopoverPortal>
    <PopoverContent
      data-slot="popover-content"
      v-bind="root()"
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :collision-padding="8"
      :aria-describedby="description ? `${id}-description` : undefined"
      @open-auto-focus="nameDialog"
    >
      <div
        v-if="title || description"
        data-slot="popover-header"
        :class="tPopoverHeaderClasses"
      >
        <h2 v-if="title" :id="`${id}-title`" :class="tPopoverTitleClasses">
          {{ title }}
        </h2>
        <p
          v-if="description"
          :id="`${id}-description`"
          :class="tPopoverDescriptionClasses"
        >
          {{ description }}
        </p>
      </div>
      <slot />
      <PopoverClose v-if="!hideClose" as-child>
        <TButton
          variant="ghost"
          size="sm"
          :aria-label="closeLabel"
          :class="tPopoverCloseClasses"
        >
          <TIcon :icon="X" size="sm" />
        </TButton>
      </PopoverClose>
    </PopoverContent>
  </PopoverPortal>
</template>
