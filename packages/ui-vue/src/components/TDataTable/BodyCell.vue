<script setup lang="ts">
import {
  formatTableNumber,
  TABLE_DETAIL_COLUMN,
  TABLE_SELECT_COLUMN,
  tableCellVars,
} from '@repo/table-core'
import { computed } from 'vue'
import BuiltInCell from './BuiltInCell.vue'
import { CellContent } from './CellContent'
import CellEditor from './CellEditor.vue'
import type { EngineCell, EngineRow } from './context'
import { useDataTableContext } from './context'
import Expander from './Expander.vue'
import SelectRow from './SelectRow.vue'
import {
  tDataTableAggregateClasses,
  tDataTableCellClasses,
  tDataTableExpanderClasses,
  tDataTableExpanderSpacerClasses,
  tDataTableGroupCountClasses,
} from './TDataTable.variants'

const props = defineProps<{
  cell: EngineCell
  index: number
  row: EngineRow
  isSelected: boolean
  isSomeSelected: boolean
  isExpanded: boolean
  canExpand: boolean
  /** Holds the row's chevron and indent: the first data cell of a tree. */
  isExpanderCell: boolean
}>()
const { labels, locale, slots, editing, startEdit } = useDataTableContext()
const isEditing = computed(
  () =>
    editing.value?.rowId === props.row.id &&
    editing.value.columnId === props.cell.column.id,
)
const editable = computed(() => {
  const editableOption = spec.value?.editable
  if (!spec.value || props.row.getIsGrouped()) return false
  return typeof editableOption === 'function'
    ? editableOption(props.row.original)
    : Boolean(editableOption)
})

const column = computed(() => props.cell.column)
const meta = computed(() => column.value.columnDef.meta)
const spec = computed(() => meta.value?.spec)
const pinned = computed(() => column.value.getIsPinned())
const edge = computed(() =>
  pinned.value === 'start' && column.value.getIsLastColumn('start')
    ? 'start'
    : pinned.value === 'end' && column.value.getIsFirstColumn('end')
      ? 'end'
      : undefined,
)
const value = computed(() => props.cell.getValue())
const aggregateText = computed(() =>
  typeof value.value === 'number'
    ? formatTableNumber(value.value, locale.value, spec.value?.number)
    : String(value.value ?? ''),
)
const cellSlot = computed(() => slots[`cell-${column.value.id}`])
const cellContext = computed(() => ({
  row: props.row.original,
  rowId: props.row.id,
  depth: props.row.depth,
  isSelected: props.isSelected,
  isExpanded: props.isExpanded,
  canExpand: props.canExpand,
  toggleExpanded: () => props.row.toggleExpanded(),
  value: value.value,
  columnId: column.value.id,
  startEdit: () => startEdit(props.row.id, column.value.id),
  tabIndex: -1,
}))
</script>

<template>
  <td
    role="gridcell"
    tabindex="-1"
    :data-col="column.id"
    :data-pin="pinned || undefined"
    :data-pin-edge="edge"
    :data-editable="editable ? '' : undefined"
    :data-editing="isEditing ? '' : undefined"
    :data-align="spec?.align ?? (spec?.type === 'number' ? 'end' : undefined)"
    :aria-colindex="index + 1"
    :class="tDataTableCellClasses"
    :style="tableCellVars(meta?.index ?? 0, pinned)"
    @dblclick="editable && !isEditing && startEdit(row.id, column.id)"
  >
    <CellEditor
      v-if="isEditing && spec"
      :spec="spec"
      :value="value"
      :row="row.original"
      :row-id="row.id"
      :column-id="column.id"
    />
    <SelectRow
      v-else-if="column.id === TABLE_SELECT_COLUMN"
      :row="row"
      :is-selected="isSelected"
      :is-some-selected="isSomeSelected"
    />
    <template v-else-if="column.id === TABLE_DETAIL_COLUMN">
      <Expander
        v-if="canExpand && !row.getIsGrouped()"
        :row="row"
        :is-expanded="isExpanded"
      />
    </template>
    <template v-else-if="cell.getIsPlaceholder()" />
    <template v-else-if="cell.getIsGrouped() && spec">
      <Expander :row="row" :is-expanded="isExpanded" />
      <BuiltInCell :spec="spec" :value="value" :row="row.original" />
      <span :class="tDataTableGroupCountClasses">
        {{ labels.groupCount(row.subRows.length) }}
      </span>
    </template>
    <template v-else-if="row.getIsGrouped() && spec">
      <span v-if="spec.aggregate" :class="tDataTableAggregateClasses">
        {{ aggregateText }}
      </span>
    </template>
    <span
      v-else-if="spec && isExpanderCell"
      :class="tDataTableExpanderClasses"
      :style="{ '--t-cell-indent': `${row.depth * 1.25}rem` }"
    >
      <Expander v-if="canExpand" :row="row" :is-expanded="isExpanded" />
      <span v-else :class="tDataTableExpanderSpacerClasses" />
      <CellContent v-if="cellSlot" :render="cellSlot" :context="cellContext" />
      <BuiltInCell v-else :spec="spec" :value="value" :row="row.original" />
    </span>
    <template v-else-if="spec">
      <CellContent v-if="cellSlot" :render="cellSlot" :context="cellContext" />
      <BuiltInCell v-else :spec="spec" :value="value" :row="row.original" />
    </template>
  </td>
</template>
