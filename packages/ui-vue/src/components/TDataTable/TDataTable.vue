<script setup lang="ts" generic="TData extends TableRowData">
import { ChevronsDownUp, ChevronsUpDown, Download } from '@lucide/vue'
import {
  bindTableColumnVars,
  createTableColumnReorder,
  createTableGrid,
  isSyntheticTableColumn,
  moveTableColumn,
  observeTableScroller,
  pickTableState,
  TABLE_DEFAULT_OVERSCAN,
  TABLE_ROW_ESTIMATE,
  type TableGridController,
  type TableRowData,
  type TableState,
  type TableStateKey,
  toDisplayItems,
  writeTableColumnVars,
} from '@repo/table-core'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  type Slots,
  watch,
} from 'vue'
import { useSplitAttrs } from '../../lib/attrs'
import { TButton } from '../TButton'
import {
  tDataTableBulkClasses,
  tDataTableBulkCountClasses,
  tDataTableClasses,
  tDataTableRefreshClasses,
  tDataTableScrollerClasses,
  tDataTableTableClasses,
  tDataTableToolbarClasses,
  tDataTableToolbarEndClasses,
  tDataTableViewportClasses,
} from './TDataTable.variants'
import { TIcon } from '../TIcon'
import { TSpinner } from '../TSpinner'
import ColumnsPanel from './ColumnsPanel.vue'
import { dataTableContextKey, type EngineTable } from './context'
import FilterChips from './FilterChips.vue'
import SearchBox from './SearchBox.vue'
import TableBody from './TableBody.vue'
import TableFooter from './TableFooter.vue'
import TableHead from './TableHead.vue'
import type {
  TDataTableCellContext,
  TDataTableEditorContext,
  TDataTableHandle,
  TDataTableHeaderContext,
  TDataTableProps,
  TDataTableRowContext,
  TDataTableToolbarContext,
} from './types'
import { useDataTable } from './useDataTable'

// A data table on TanStack Table. The engine's options come from @repo/table-core; this layer holds the
// engine through its Vue adapter and renders what it reads from it. Class and style go on the root, other
// attributes (aria-label…) on the <table>.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TDataTableProps<TData>>(), {
  mode: 'client',
  virtualized: false,
  selection: false,
  density: 'comfortable',
  pagination: true,
  hover: true,
  stickyHeader: true,
})
const state = defineModel<Partial<TableState> | undefined>('state', {
  default: undefined,
})
const emit = defineEmits<{
  retry: []
  'state-change': [state: TableState, changed: TableStateKey[]]
}>()
const slots = defineSlots<
  {
    toolbar?: (context: TDataTableToolbarContext<TData>) => any
    'bulk-actions'?: (context: TDataTableToolbarContext<TData>) => any
    detail?: (context: TDataTableRowContext<TData>) => any
    empty?: () => any
    error?: (context: { error: unknown; retry: () => void }) => any
  } & {
    [K in `cell-${string}`]?: (context: TDataTableCellContext<TData>) => any
  } & {
    [K in `header-${string}`]?: (context: TDataTableHeaderContext) => any
  } & {
    [K in `editor-${string}`]?: (context: TDataTableEditorContext<TData>) => any
  }
>()

const rootRef = ref<HTMLElement | null>(null)
const scrollerRef = ref<HTMLElement | null>(null)
const tableRef = ref<HTMLElement | null>(null)
const headRef = ref<HTMLElement | null>(null)

const { root: rootAttrs, inner: tableAttrs } = useSplitAttrs(
  () => tDataTableClasses,
)

const {
  table: engine,
  bridge,
  labels,
  pageSizes,
  exportCsv,
  hasSelection,
  hasDetail,
  hasTree,
  paginated,
  server,
} = useDataTable(props, {
  state,
  hasDetail: () => Boolean(slots.detail),
  root: rootRef,
  onStateChange: (next, changed) => emit('state-change', next, changed),
})
const table = engine as unknown as EngineTable

const editing = ref<{ rowId: string; columnId: string } | null>(null)
let grid: TableGridController | null = null

provide(dataTableContextKey, {
  labels,
  locale: computed(() => props.locale),
  slots: slots as unknown as Slots,
  onCellEdit: () => props.onCellEdit as never,
  editing,
  startEdit: (rowId, columnId) => {
    editing.value = { rowId, columnId }
  },
  finishEdit: (move) => {
    const current = editing.value
    editing.value = null
    if (!current) return
    const ids = visibleColumns.value.map((column) => column.id)
    const next = ids[ids.indexOf(current.columnId) + (move ?? 0)]
    void nextTick(() =>
      grid?.focusCell(current.rowId, next ?? current.columnId),
    )
  },
})

const scope = computed(
  () => props.selectAllScope ?? (server.value ? 'page' : 'all'),
)
const rows = computed(() => table.getRowModel().rows)
const hierarchical = computed(
  () => hasTree.value || table.atoms.grouping.get().length > 0,
)
const items = computed(() => {
  // A detail panel's item depends on the expansion, which leaves the rows as they are.
  if (hasDetail.value) void table.atoms.expanded.get()
  return toDisplayItems(rows.value, {
    detail: hasDetail.value,
    tree: hierarchical.value,
  })
})
const visibleColumns = computed(() => table.getVisibleLeafColumns())
const expanderColumnId = computed(() =>
  hasTree.value
    ? visibleColumns.value.find((column) => !isSyntheticTableColumn(column.id))
        ?.id
    : undefined,
)
const columnsKey = computed(() =>
  visibleColumns.value
    .map((column) => `${column.id}:${column.getIsPinned() || ''}`)
    .join(','),
)
const pagination = computed(() => table.atoms.pagination.get())
const rowSelection = computed(() => table.atoms.rowSelection.get())
const selectedIds = computed(() => Object.keys(rowSelection.value))
const clearSelection = () => table.setRowSelection({})
const selectedRows = () =>
  table.getSelectedRowModel().flatRows.map((row) => row.original as TData)
const toolbarContext = computed<TDataTableToolbarContext<TData>>(() => ({
  selectedIds: selectedIds.value,
  get selectedRows() {
    return selectedRows()
  },
  clearSelection,
  exportCsv,
}))

const total = computed(() =>
  paginated.value ? table.getRowCount() : items.value.length,
)
// With children on their parent's page, a row's position overall isn't known from the page.
const pageOffset = computed(() =>
  paginated.value && !hierarchical.value
    ? pagination.value.pageIndex * pagination.value.pageSize
    : 0,
)
const ariaRowCount = computed(() =>
  hierarchical.value && paginated.value ? -1 : total.value + 1,
)
const scrollerStyle = computed(() => ({
  maxHeight:
    typeof props.maxHeight === 'number'
      ? `${props.maxHeight}px`
      : props.maxHeight,
}))

const headerHeight = ref(0)
const activeVersion = ref(0)
const scrollToItem = shallowRef<(index: number) => void>(() => {})
const virtualProps = computed(() => {
  if (!props.virtualized) return undefined
  const options = typeof props.virtualized === 'object' ? props.virtualized : {}
  return {
    scroller: scrollerRef.value,
    headerHeight: headerHeight.value,
    estimateRowHeight:
      options.estimateRowHeight ?? TABLE_ROW_ESTIMATE[props.density],
    overscan: options.overscan ?? TABLE_DEFAULT_OVERSCAN,
    activeRowKey: () => grid?.getActiveRowKey() ?? null,
    activeVersion: activeVersion.value,
    scrollToItem,
  }
})

const cleanups: (() => void)[] = []
onMounted(() => {
  if (!rootRef.value || !scrollerRef.value || !tableRef.value) return
  cleanups.push(bindTableColumnVars(rootRef.value, table))
  cleanups.push(
    observeTableScroller(
      rootRef.value,
      scrollerRef.value,
      headRef.value,
      (height) => {
        headerHeight.value = height
      },
    ),
  )
  grid = createTableGrid({
    root: tableRef.value,
    getRowKeys: () => items.value.map((item) => item.key),
    getColumnIds: () => visibleColumns.value.map((column) => column.id),
    getPageRows: () =>
      Math.max(
        1,
        Math.floor(
          (scrollerRef.value?.clientHeight ?? 440) /
            TABLE_ROW_ESTIMATE[props.density],
        ) - 1,
      ),
    scrollToItem: (index) => scrollToItem.value(index),
    onActiveRowChange: () => {
      activeVersion.value += 1
    },
    startEdit: (rowId, columnId) => {
      editing.value = { rowId, columnId }
      return true
    },
    resizeColumn: (columnId, delta) => {
      const column = table.getColumn(columnId)
      if (!column) return
      const { minSize = 0, maxSize = Infinity } = column.columnDef
      const size = Math.min(
        maxSize,
        Math.max(minSize, column.getSize() + delta),
      )
      table.setColumnSizing((sizing) => ({ ...sizing, [columnId]: size }))
    },
  })
  cleanups.push(() => grid?.destroy())
  if (headRef.value) {
    cleanups.push(
      createTableColumnReorder({
        head: headRef.value,
        scroller: scrollerRef.value,
        onReorder: (id, targetId, side) =>
          table.setColumnOrder(
            moveTableColumn(
              table.getAllLeafColumns().map((column) => column.id),
              id,
              targetId,
              side,
            ),
          ),
      }),
    )
  }
  grid.sync()
})
onBeforeUnmount(() => cleanups.forEach((cleanup) => cleanup()))
const syncGrid = () => grid?.sync()

watch(columnsKey, () => {
  if (rootRef.value) writeTableColumnVars(rootRef.value, table)
  void nextTick(syncGrid)
})

// A shrunken total (filtered, refetched) can leave the page past the end, where TPagination would show the
// last page over an empty body.
watch(
  () => [table.getPageCount(), pagination.value.pageIndex] as const,
  ([pageCount, pageIndex]) => {
    if (!paginated.value || props.loading) return
    const last = Math.max(0, pageCount - 1)
    if (pageIndex > last) table.setPageIndex(last)
  },
)

defineExpose<TDataTableHandle<TData>>({
  getState: () => pickTableState(table.store.get()),
  setState: (next) => bridge.setState(next),
  exportCsv,
  expandAll: () => table.toggleAllRowsExpanded(true),
  collapseAll: () => table.toggleAllRowsExpanded(false),
  clearFilters: () => {
    table.setColumnFilters([])
    table.setGlobalFilter('')
  },
  clearSelection,
  getSelectedRows: selectedRows,
  scrollToRow: (id) => {
    if (props.virtualized) {
      const index = items.value.findIndex((item) => item.key === id)
      if (index >= 0) scrollToItem.value(index)
      return
    }
    tableRef.value
      ?.querySelector(`[data-row-key="${CSS.escape(id)}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  },
})
</script>

<template>
  <div
    ref="rootRef"
    data-slot="data-table"
    :data-density="density"
    v-bind="rootAttrs()"
  >
    <div
      v-if="
        search ||
        csvExport ||
        columnsPanel ||
        slots.toolbar ||
        hierarchical ||
        hasDetail
      "
      data-slot="data-table-toolbar"
      :class="tDataTableToolbarClasses"
    >
      <SearchBox v-if="search" :table="table" />
      <slot name="toolbar" v-bind="toolbarContext" />
      <div :class="tDataTableToolbarEndClasses">
        <ColumnsPanel v-if="columnsPanel" :table="table" />
        <template v-if="hierarchical || hasDetail">
          <TButton
            variant="ghost"
            size="sm"
            @click="table.toggleAllRowsExpanded(true)"
          >
            <TIcon :icon="ChevronsUpDown" size="sm" />
            {{ labels.expandAll }}
          </TButton>
          <TButton
            variant="ghost"
            size="sm"
            @click="table.toggleAllRowsExpanded(false)"
          >
            <TIcon :icon="ChevronsDownUp" size="sm" />
            {{ labels.collapseAll }}
          </TButton>
        </template>
        <TButton
          v-if="csvExport"
          variant="outline"
          size="sm"
          @click="exportCsv()"
        >
          <TIcon :icon="Download" size="sm" />
          {{ labels.exportCsv }}
        </TButton>
      </div>
    </div>
    <FilterChips :table="table" />
    <div
      v-if="selectedIds.length"
      data-slot="data-table-bulk"
      :class="tDataTableBulkClasses"
    >
      <span :class="tDataTableBulkCountClasses" aria-live="polite">
        {{ labels.selectedCount(selectedIds.length) }}
      </span>
      <slot name="bulk-actions" v-bind="toolbarContext" />
      <TButton variant="ghost" size="sm" @click="clearSelection()">
        {{ labels.clearSelection }}
      </TButton>
    </div>
    <div :class="tDataTableViewportClasses">
      <div
        ref="scrollerRef"
        data-slot="data-table-scroller"
        :class="tDataTableScrollerClasses"
        :style="scrollerStyle"
      >
        <table
          ref="tableRef"
          :role="hierarchical ? 'treegrid' : 'grid'"
          :aria-rowcount="ariaRowCount"
          :aria-colcount="visibleColumns.length"
          :aria-busy="loading || refetching || undefined"
          :aria-multiselectable="selection === 'multiple' ? true : undefined"
          :class="tDataTableTableClasses"
          v-bind="tableAttrs()"
        >
          <TableHead
            v-model:element="headRef"
            :table="table"
            :sticky="stickyHeader"
            :scope="scope"
          />
          <TableBody
            :table="table"
            :items="items"
            :zebra="zebra"
            :hover="hover"
            :loading="loading"
            :refetching="refetching"
            :error="error"
            :page-offset="pageOffset"
            :selectable="hasSelection"
            :hierarchical="hierarchical"
            :expander-column-id="expanderColumnId"
            :virtual="virtualProps"
            @rendered="syncGrid"
            @retry="emit('retry')"
          />
        </table>
      </div>
      <span v-if="loading" role="status" class="sr-only">{{
        labels.loading
      }}</span>
      <div v-if="refetching" :class="tDataTableRefreshClasses">
        <TSpinner size="sm" aria-hidden="true" />
        <span role="status">{{ labels.refreshing }}</span>
      </div>
    </div>
    <TableFooter
      v-if="paginated"
      :table="table"
      :page-sizes="pageSizes"
      :disabled="loading"
    />
  </div>
</template>
