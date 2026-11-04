<script setup lang="ts">
import { computed } from 'vue'
import BodyCell from './BodyCell.vue'
import type { EngineRow } from './context'
import {
  tDataTableCellFillerClasses,
  tDataTableRowClasses,
} from './TDataTable.variants'

const props = defineProps<{
  row: EngineRow
  rowIndex: number
  isSelected: boolean
  isSomeSelected: boolean
  isExpanded: boolean
  canExpand: boolean
  selectable: boolean
  zebra: boolean
  hover: boolean
  /** A tree or groups: the row has a level, and says whether it is open. */
  hierarchical: boolean
  /** A tree's rows have their chevron in this column. */
  expanderColumnId?: string
  positionInSet?: number
  setSize?: number
  /** A virtual row: its offset, and how the virtualizer measures it. */
  virtualStart?: number
  virtualIndex?: number
  measure?: (element: Element | null) => void
}>()

const measureRef = (element: unknown) =>
  props.measure?.(element as Element | null)

const cells = computed(() => props.row.getVisibleCells())
const fillerAt = computed(() => {
  const firstEnd = cells.value.findIndex(
    (cell) => cell.column.getIsPinned() === 'end',
  )
  return firstEnd < 0 ? cells.value.length : firstEnd
})
</script>

<template>
  <tr
    :ref="measureRef"
    role="row"
    :data-row-key="row.id"
    :data-index="virtualIndex"
    :data-virtual="virtualStart === undefined ? undefined : ''"
    :data-zebra="zebra && !isSelected ? 'odd' : undefined"
    :data-selected="isSelected ? '' : undefined"
    :data-hover="hover ? '' : undefined"
    :aria-rowindex="rowIndex"
    :aria-selected="selectable ? isSelected : undefined"
    :aria-level="hierarchical ? row.depth + 1 : undefined"
    :aria-setsize="hierarchical ? setSize : undefined"
    :aria-posinset="hierarchical ? positionInSet : undefined"
    :aria-expanded="hierarchical && canExpand ? isExpanded : undefined"
    :class="tDataTableRowClasses"
    :style="
      virtualStart === undefined
        ? undefined
        : { transform: `translateY(${virtualStart}px)` }
    "
  >
    <template v-for="(cell, index) in cells" :key="cell.id">
      <td
        v-if="index === fillerAt"
        role="presentation"
        :class="tDataTableCellFillerClasses"
      />
      <BodyCell
        :cell="cell"
        :index="index"
        :row="row"
        :is-selected="isSelected"
        :is-some-selected="isSomeSelected"
        :is-expanded="isExpanded"
        :can-expand="canExpand"
        :is-expander-cell="cell.column.id === expanderColumnId"
      />
    </template>
    <td
      v-if="fillerAt === cells.length"
      role="presentation"
      :class="tDataTableCellFillerClasses"
    />
  </tr>
</template>
