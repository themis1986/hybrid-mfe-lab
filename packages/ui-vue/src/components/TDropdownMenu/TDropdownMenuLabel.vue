<script setup lang="ts">
import { DropdownMenuLabel } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDropdownMenuLabelClasses } from './TDropdownMenu.variants'
import type { TDropdownMenuLabelProps } from './types'

defineOptions({ inheritAttrs: false })
defineProps<TDropdownMenuLabelProps>()
const root = useRootAttrs(() => tDropdownMenuLabelClasses)
</script>

<template>
  <DropdownMenuLabel
    data-slot="dropdown-menu-label"
    v-bind="root()"
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </DropdownMenuLabel>
</template>
