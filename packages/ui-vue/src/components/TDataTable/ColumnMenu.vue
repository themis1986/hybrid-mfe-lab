<script setup lang="ts">
import { EllipsisVertical } from '@lucide/vue'
import { computed } from 'vue'
import { TButton } from '../TButton'
import {
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuSeparator,
  TDropdownMenuTrigger,
} from '../TDropdownMenu'
import { TIcon } from '../TIcon'
import type { EngineColumn } from './context'
import { useDataTableContext } from './context'
import { tDataTableHeadButtonClasses } from './TDataTable.variants'

const props = defineProps<{ column: EngineColumn; title: string }>()
const { labels } = useDataTableContext()

const canSort = computed(() => props.column.getCanSort())
const canPin = computed(() => props.column.getCanPin())
const canHide = computed(() => props.column.getCanHide())
const canGroup = computed(() => props.column.getCanGroup())
const pinned = computed(() => props.column.getIsPinned())
</script>

<template>
  <TDropdownMenu v-if="canSort || canPin || canHide || canGroup">
    <TDropdownMenuTrigger as-child>
      <TButton
        variant="ghost"
        size="sm"
        tabindex="-1"
        data-no-reorder=""
        :aria-label="labels.columnMenu(title)"
        :class="tDataTableHeadButtonClasses"
      >
        <TIcon :icon="EllipsisVertical" size="sm" />
      </TButton>
    </TDropdownMenuTrigger>
    <TDropdownMenuContent align="end">
      <template v-if="canSort">
        <TDropdownMenuItem @select="column.toggleSorting(false)">
          {{ labels.sortAscending }}
        </TDropdownMenuItem>
        <TDropdownMenuItem @select="column.toggleSorting(true)">
          {{ labels.sortDescending }}
        </TDropdownMenuItem>
        <TDropdownMenuItem
          v-if="column.getIsSorted()"
          @select="column.clearSorting()"
        >
          {{ labels.clearSort }}
        </TDropdownMenuItem>
        <TDropdownMenuSeparator />
      </template>
      <template v-if="canPin">
        <TDropdownMenuItem
          v-if="pinned !== 'start'"
          @select="column.pin('start')"
        >
          {{ labels.pinStart }}
        </TDropdownMenuItem>
        <TDropdownMenuItem v-if="pinned !== 'end'" @select="column.pin('end')">
          {{ labels.pinEnd }}
        </TDropdownMenuItem>
        <TDropdownMenuItem v-if="pinned" @select="column.pin(false)">
          {{ labels.unpin }}
        </TDropdownMenuItem>
      </template>
      <TDropdownMenuItem v-if="canGroup" @select="column.toggleGrouping()">
        {{ column.getIsGrouped() ? labels.ungroup : labels.groupBy }}
      </TDropdownMenuItem>
      <TDropdownMenuItem
        v-if="canHide"
        @select="column.toggleVisibility(false)"
      >
        {{ labels.hideColumn }}
      </TDropdownMenuItem>
    </TDropdownMenuContent>
  </TDropdownMenu>
</template>
