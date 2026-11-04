<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDropdownMenuItemVariants } from './TDropdownMenu.variants'
import type { TDropdownMenuItemProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<TDropdownMenuItemProps>()
// The caller's listeners (@select) go on Reka's item.
const root = useRootAttrs(() => tDropdownMenuItemVariants({ tone: props.tone }))
</script>

<template>
  <DropdownMenuItem
    data-slot="dropdown-menu-item"
    v-bind="root()"
    :as="as"
    :as-child="asChild"
    :disabled="disabled"
  >
    <slot />
  </DropdownMenuItem>
</template>
