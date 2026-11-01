<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tTooltipArrowClasses, tTooltipContentClasses } from './TTooltip.variants'
import type { TTooltipProps } from './types'

// A hint shown on hover (after `delayDuration`) and on keyboard focus (Reka Tooltip). The default slot is
// the trigger (one focusable element); it gets aria-describedby while the tooltip is open. Each tooltip
// brings its own Reka provider, so it needs no setup. A disabled button fires no pointer events: wrap it in
// a <span tabindex="0">. The caller's attributes go on the tooltip content.
defineOptions({ inheritAttrs: false })
// The explicit undefined default keeps "not set" apart from "closed", so the tooltip is only controlled
// when v-model:open is bound.
withDefaults(defineProps<TTooltipProps>(), {
  side: 'top',
  align: 'center',
  sideOffset: 6,
  delayDuration: 300,
  arrow: true,
  defaultOpen: undefined,
})
const open = defineModel<boolean | undefined>('open', { default: undefined })
const root = useRootAttrs(
  () => tTooltipContentClasses,
  () => ({ '--t-tooltip-transform-origin': 'var(--reka-tooltip-content-transform-origin)' }),
)
</script>

<template>
  <slot v-if="disabled" />
  <TooltipProvider v-else :delay-duration="delayDuration">
    <TooltipRoot v-model:open="open" :default-open="defaultOpen">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          data-slot="tooltip"
          v-bind="root()"
          :side="side"
          :align="align"
          :side-offset="sideOffset"
          :collision-padding="8"
        >
          <slot name="content">{{ content }}</slot>
          <TooltipArrow v-if="arrow" data-slot="tooltip-arrow" :width="10" :height="5" :class="tTooltipArrowClasses" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
