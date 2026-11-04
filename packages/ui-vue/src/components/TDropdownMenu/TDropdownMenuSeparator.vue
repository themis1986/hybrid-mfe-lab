<script setup lang="ts">
import { DropdownMenuSeparator } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDropdownMenuSeparatorClasses } from './TDropdownMenu.variants'
import type { TDropdownMenuSeparatorProps } from './types'

defineOptions({ inheritAttrs: false })
defineProps<TDropdownMenuSeparatorProps>()
const root = useRootAttrs(() => tDropdownMenuSeparatorClasses)
</script>

<template>
  <DropdownMenuSeparator
    data-slot="dropdown-menu-separator"
    v-bind="root()"
    :as="as"
    :as-child="asChild"
  />
</template>
