<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDropdownMenuContentClasses } from './TDropdownMenu.variants'
import type { TDropdownMenuContentProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TDropdownMenuContentProps>(), {
  align: 'start',
  sideOffset: 4,
})
const root = useRootAttrs(
  () => tDropdownMenuContentClasses,
  () => ({
    '--t-dropdown-menu-available-height':
      'var(--reka-dropdown-menu-content-available-height)',
    '--t-dropdown-menu-transform-origin':
      'var(--reka-dropdown-menu-content-transform-origin)',
  }),
)
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      data-slot="dropdown-menu-content"
      v-bind="root()"
      :as="as"
      :as-child="asChild"
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :collision-padding="8"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
