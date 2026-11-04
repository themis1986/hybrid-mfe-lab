<script setup lang="ts">
import { TABLE_FULL_ROW_COLUMN, tableDetailKey } from '@repo/table-core'
import { computed } from 'vue'
import { CellContent } from './CellContent'
import type { EngineRow } from './context'
import { useDataTableContext } from './context'
import {
  tDataTableFullCellClasses,
  tDataTableFullContentClasses,
  tDataTableRowClasses,
} from './TDataTable.variants'

// The panel under an open row: a row of its own, so it has its own height.
const props = defineProps<{
  row: EngineRow
  rowIndex: number
  isSelected: boolean
  zebra: boolean
  /** A virtual row: its offset, and how the virtualizer measures it. */
  virtualStart?: number
  virtualIndex?: number
  measure?: (element: Element | null) => void
}>()

const measureRef = (element: unknown) =>
  props.measure?.(element as Element | null)
const { slots } = useDataTableContext()

const context = computed(() => ({
  row: props.row.original,
  rowId: props.row.id,
  depth: props.row.depth,
  isSelected: props.isSelected,
  isExpanded: true,
  canExpand: true,
  toggleExpanded: () => props.row.toggleExpanded(),
}))
</script>

<template>
  <tr
    :ref="measureRef"
    role="row"
    :data-row-key="tableDetailKey(row.id)"
    :data-index="virtualIndex"
    :data-virtual="virtualStart === undefined ? undefined : ''"
    :data-zebra="zebra && !isSelected ? 'odd' : undefined"
    :aria-rowindex="rowIndex"
    :class="tDataTableRowClasses"
    :style="
      virtualStart === undefined
        ? undefined
        : { transform: `translateY(${virtualStart}px)` }
    "
  >
    <td
      role="gridcell"
      tabindex="-1"
      :data-col="TABLE_FULL_ROW_COLUMN"
      :class="tDataTableFullCellClasses"
    >
      <div :class="tDataTableFullContentClasses">
        <CellContent
          v-if="slots.detail"
          :render="slots.detail"
          :context="context"
        />
      </div>
    </td>
  </tr>
</template>
