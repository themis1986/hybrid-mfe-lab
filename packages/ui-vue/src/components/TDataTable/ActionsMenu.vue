<script setup lang="ts">
import { MoreHorizontal } from '@lucide/vue'
import { TButton } from '../TButton'
import {
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuTrigger,
} from '../TDropdownMenu'
import { TIcon } from '../TIcon'
import { useDataTableContext } from './context'
import { tDataTableCellButtonClasses } from './TDataTable.variants'
import type { TDataTableColumn } from './types'

defineProps<{ spec: TDataTableColumn<any>; row: unknown }>()
const { labels } = useDataTableContext()
</script>

<template>
  <TDropdownMenu>
    <TDropdownMenuTrigger as-child>
      <TButton
        variant="ghost"
        size="sm"
        tabindex="-1"
        data-t-activate="menu"
        :aria-label="labels.rowActions"
        :class="tDataTableCellButtonClasses"
      >
        <TIcon :icon="MoreHorizontal" size="sm" />
      </TButton>
    </TDropdownMenuTrigger>
    <TDropdownMenuContent align="end">
      <TDropdownMenuItem
        v-for="action in spec.actions?.(row) ?? []"
        :key="action.id"
        :tone="action.tone"
        :disabled="action.disabled"
        @select="action.onSelect()"
      >
        <TIcon v-if="action.icon" :icon="action.icon" size="sm" />
        {{ action.label }}
      </TDropdownMenuItem>
    </TDropdownMenuContent>
  </TDropdownMenu>
</template>
