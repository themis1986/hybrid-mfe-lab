<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronsUpDown, ListFilter } from '@lucide/vue'
import {
  isSyntheticTableColumn,
  TABLE_SELECT_COLUMN,
  tableCellVars,
} from '@repo/table-core'
import { computed } from 'vue'
import { TIcon } from '../TIcon'
import ColumnFilter from './ColumnFilter.vue'
import ColumnMenu from './ColumnMenu.vue'
import { CellContent } from './CellContent'
import type { EngineHeader, EngineTable } from './context'
import { useDataTableContext } from './context'
import SelectAll from './SelectAll.vue'
import {
  tDataTableFilterMarkClasses,
  tDataTableHeadActionsClasses,
  tDataTableHeadCellClasses,
  tDataTableHeadLabelClasses,
  tDataTableResizeClasses,
  tDataTableSortClasses,
  tDataTableSortIconClasses,
  tDataTableSortOrderClasses,
} from './TDataTable.variants'

const props = defineProps<{
  table: EngineTable
  header: EngineHeader
  index: number
  scope: 'page' | 'all'
}>()
const { labels, slots } = useDataTableContext()

const column = computed(() => props.header.column)
const meta = computed(() => column.value.columnDef.meta)
const spec = computed(() => meta.value?.spec)
const pinned = computed(() => column.value.getIsPinned())
const sorted = computed(() => column.value.getIsSorted())
const sortIndex = computed(() => column.value.getSortIndex())
const multiSort = computed(() => props.table.atoms.sorting.get().length > 1)
const title = computed(() => spec.value?.title ?? '')
const headerSlot = computed(() => slots[`header-${column.value.id}`])
const edge = computed(() =>
  pinned.value === 'start' && column.value.getIsLastColumn('start')
    ? 'start'
    : pinned.value === 'end' && column.value.getIsFirstColumn('end')
      ? 'end'
      : undefined,
)
// ARIA asks for one sorted header at a time: the primary one. The others show their order.
const ariaSort = computed(() =>
  sorted.value && sortIndex.value === 0
    ? sorted.value === 'asc'
      ? 'ascending'
      : 'descending'
    : undefined,
)
</script>

<template>
  <th
    role="columnheader"
    scope="col"
    tabindex="-1"
    :data-col="column.id"
    :data-pin="pinned || undefined"
    :data-pin-edge="edge"
    :data-pin-region="pinned || 'center'"
    :data-align="spec?.align"
    :data-reorderable="spec && spec.reorderable !== false ? '' : undefined"
    :aria-colindex="index + 1"
    :aria-sort="ariaSort"
    :class="tDataTableHeadCellClasses"
    :style="tableCellVars(meta?.index ?? 0, pinned)"
  >
    <template v-if="column.id === TABLE_SELECT_COLUMN">
      <SelectAll
        v-if="table.options.enableMultiRowSelection"
        :table="table"
        :scope="scope"
      />
    </template>
    <template v-else-if="!isSyntheticTableColumn(column.id)">
      <button
        v-if="column.getCanSort()"
        type="button"
        tabindex="-1"
        data-t-activate=""
        :class="tDataTableSortClasses"
        @click="column.getToggleSortingHandler()?.($event)"
      >
        <span :class="tDataTableHeadLabelClasses">
          <CellContent
            v-if="headerSlot"
            :render="headerSlot"
            :context="{ columnId: column.id, title }"
          />
          <template v-else>{{ title }}</template>
        </span>
        <TIcon
          :icon="
            sorted === 'asc'
              ? ArrowUp
              : sorted === 'desc'
                ? ArrowDown
                : ChevronsUpDown
          "
          :class="tDataTableSortIconClasses"
        />
        <span
          v-if="sorted && multiSort"
          :class="tDataTableSortOrderClasses"
          :aria-label="labels.sortOrder(sortIndex + 1)"
        >
          {{ sortIndex + 1 }}
        </span>
        <TIcon
          v-if="column.getIsFiltered()"
          :icon="ListFilter"
          :class="tDataTableFilterMarkClasses"
        />
      </button>
      <span v-else :class="tDataTableHeadLabelClasses">
        <CellContent
          v-if="headerSlot"
          :render="headerSlot"
          :context="{ columnId: column.id, title }"
        />
        <template v-else>{{ title }}</template>
      </span>
      <span v-if="spec" :class="tDataTableHeadActionsClasses">
        <ColumnFilter
          v-if="spec.filter && column.getCanFilter()"
          :column="column"
          :filter="spec.filter"
          :title="title"
        />
        <ColumnMenu :column="column" :title="title" />
      </span>
      <div
        v-if="column.getCanResize()"
        role="separator"
        aria-orientation="vertical"
        :aria-label="labels.resizeColumn(title)"
        tabindex="-1"
        data-t-resize=""
        data-no-reorder=""
        :class="tDataTableResizeClasses"
        @mousedown="header.getResizeHandler()($event)"
        @touchstart="header.getResizeHandler()($event)"
        @dblclick="column.resetSize()"
      />
    </template>
  </th>
</template>
