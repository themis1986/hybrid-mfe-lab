<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import type { EngineRow } from './context'
import { useDataTableContext } from './context'
import {
  tDataTableCellButtonSmallClasses,
  tDataTableChevronClasses,
} from './TDataTable.variants'

defineProps<{ row: EngineRow; isExpanded: boolean }>()
const { labels } = useDataTableContext()
</script>

<template>
  <TButton
    variant="ghost"
    size="sm"
    tabindex="-1"
    data-t-activate=""
    :aria-label="isExpanded ? labels.collapseRow : labels.expandRow"
    :aria-expanded="isExpanded"
    :class="tDataTableCellButtonSmallClasses"
    @click="row.toggleExpanded()"
  >
    <TIcon
      :icon="ChevronRight"
      :data-open="isExpanded ? '' : undefined"
      :class="tDataTableChevronClasses"
    />
  </TButton>
</template>
