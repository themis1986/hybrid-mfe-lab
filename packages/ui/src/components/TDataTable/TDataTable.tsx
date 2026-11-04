import {
  bindTableColumnVars,
  createTableColumnReorder,
  createTableGrid,
  isSyntheticTableColumn,
  moveTableColumn,
  observeTableScroller,
  TABLE_DEFAULT_OVERSCAN,
  TABLE_ROW_ESTIMATE,
  pickTableState,
  type TableGridController,
  type TableRowData,
  toDisplayItems,
  writeTableColumnVars,
} from '@repo/table-core'
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../lib/cn'
import { useLatest } from '../../lib/latest'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import { TSpinner } from '../TSpinner'
import { Body } from './Body'
import { ColumnsPanel } from './ColumnsPanel'
import { DataTableContext, type EngineTable } from './context'
import { Footer } from './Footer'
import { Head } from './Head'
import {
  tDataTableClasses,
  tDataTableRefreshClasses,
  tDataTableScrollerClasses,
  tDataTableTableClasses,
  tDataTableViewportClasses,
} from './TDataTable.variants'
import { BulkBar, FilterChips, Toolbar } from './Toolbar'
import type { TDataTableProps, TDataTableToolbarContext } from './types'
import { useDataTable } from './useDataTable'

// A data table on TanStack Table. The engine's options come from @repo/table-core; this layer holds the
// engine through its React adapter and renders what it reads from it.
export function TDataTable<TData extends TableRowData>(
  props: TDataTableProps<TData>,
) {
  const {
    density = 'comfortable',
    zebra = false,
    hover = true,
    stickyHeader = true,
    maxHeight,
    search = false,
    columnsPanel = false,
    virtualized = false,
    loading = false,
    refetching = false,
    error,
    onRetry,
    locale,
    selection = false,
    selectAllScope,
    renderToolbar,
    renderBulkActions,
    renderEmpty,
    renderError,
    className,
    ref,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  } = props
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const headRef = useRef<HTMLTableSectionElement>(null)
  const gridRef = useRef<TableGridController | null>(null)
  const latest = useLatest(props)
  const {
    table: rawTable,
    bridge,
    labels,
    pageSizes,
    exportCsv,
    hasSelection,
    hasDetail,
    hasTree,
    paginated,
    server,
    canExport,
  } = useDataTable(props, rootRef)
  const table = rawTable as unknown as EngineTable<TData>

  const scope = selectAllScope ?? (server ? 'page' : 'all')
  const rows = table.getRowModel().rows
  const { expanded, rowSelection, pagination, grouping } = table.state
  const hierarchical = hasTree || grouping.length > 0
  const items = useMemo(
    () => toDisplayItems(rows, { detail: hasDetail, tree: hierarchical }),
    // A detail panel's item depends on the expansion, which leaves the rows as they are.
    [rows, hasDetail, hierarchical, hasDetail ? expanded : null],
  )
  const itemsRef = useLatest(items)
  const visibleColumns = table.getVisibleLeafColumns()
  const columnIds = visibleColumns.map((column) => column.id)
  const columnIdsRef = useLatest(columnIds)
  const columnsKey = visibleColumns
    .map((column) => `${column.id}:${column.getIsPinned() || ''}`)
    .join(',')

  const expanderColumnId = hasTree
    ? visibleColumns.find((column) => !isSyntheticTableColumn(column.id))?.id
    : undefined

  const [editing, setEditing] = useState<{
    rowId: string
    columnId: string
  } | null>(null)
  const startEdit = useCallback(
    (rowId: string, columnId: string) => setEditing({ rowId, columnId }),
    [],
  )
  const editingRef = useLatest(editing)
  const finishEdit = useCallback(
    (move?: 1 | -1) => {
      const current = editingRef.current
      setEditing(null)
      if (!current) return
      const ids = columnIdsRef.current
      const next = ids[ids.indexOf(current.columnId) + (move ?? 0)]
      gridRef.current?.focusCell(current.rowId, next ?? current.columnId)
    },
    [columnIdsRef, editingRef],
  )

  const context = useMemo(
    () => ({
      labels,
      locale,
      latest,
      startEdit,
      finishEdit,
    }),
    [labels, locale, latest, startEdit, finishEdit],
  )

  const atoms = table.atoms
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    return bindTableColumnVars(root, table)
    // Bound once per engine: `table` is a new object per render, its atoms aren't.
  }, [atoms])
  useLayoutEffect(() => {
    if (rootRef.current) writeTableColumnVars(rootRef.current, table)
  }, [columnsKey])

  const [headerHeight, setHeaderHeight] = useState(0)
  useLayoutEffect(() => {
    if (!rootRef.current || !scrollerRef.current) return
    return observeTableScroller(
      rootRef.current,
      scrollerRef.current,
      headRef.current,
      setHeaderHeight,
    )
  }, [])

  const tableRefLatest = useLatest(table)
  const densityRef = useLatest(density)
  const scrollToItemRef = useRef<(index: number) => void>(() => {})
  // A change of active row re-renders the body, whose virtualizer then keeps that row mounted.
  const [, setActiveVersion] = useState(0)
  const virtualOptions = typeof virtualized === 'object' ? virtualized : {}
  useEffect(() => {
    if (!headRef.current || !scrollerRef.current) return
    return createTableColumnReorder({
      head: headRef.current,
      scroller: scrollerRef.current,
      onReorder: (id, targetId, side) => {
        const current = tableRefLatest.current
        current.setColumnOrder(
          moveTableColumn(
            current.getAllLeafColumns().map((column) => column.id),
            id,
            targetId,
            side,
          ),
        )
      },
    })
  }, [tableRefLatest])

  useEffect(() => {
    const element = tableRef.current
    if (!element) return
    const grid = createTableGrid({
      root: element,
      getRowKeys: () => itemsRef.current.map((item) => item.key),
      getColumnIds: () => columnIdsRef.current,
      getPageRows: () =>
        Math.max(
          1,
          Math.floor(
            (scrollerRef.current?.clientHeight ?? 440) /
              TABLE_ROW_ESTIMATE[densityRef.current],
          ) - 1,
        ),
      scrollToItem: (index) => scrollToItemRef.current(index),
      onActiveRowChange: () => setActiveVersion((version) => version + 1),
      startEdit: (rowId, columnId) => {
        setEditing({ rowId, columnId })
        return true
      },
      resizeColumn: (columnId, delta) => {
        const column = tableRefLatest.current.getColumn(columnId)
        if (!column) return
        const { minSize = 0, maxSize = Infinity } = column.columnDef
        const size = Math.min(
          maxSize,
          Math.max(minSize, column.getSize() + delta),
        )
        tableRefLatest.current.setColumnSizing((sizing) => ({
          ...sizing,
          [columnId]: size,
        }))
      },
    })
    gridRef.current = grid
    grid.sync()
    return () => {
      grid.destroy()
      gridRef.current = null
    }
  }, [columnIdsRef, itemsRef, tableRefLatest])

  const syncGrid = useCallback(() => gridRef.current?.sync(), [])

  // A shrunken total (filtered, refetched) can leave the page past the end, where TPagination would show
  // the last page over an empty body.
  const pageCount = table.getPageCount()
  useEffect(() => {
    if (!paginated || loading) return
    const last = Math.max(0, pageCount - 1)
    if (pagination.pageIndex > last) table.setPageIndex(last)
  }, [paginated, loading, pageCount, pagination.pageIndex, table])

  const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection])
  const clearSelection = useCallback(() => table.setRowSelection({}), [table])
  const toolbarContext: TDataTableToolbarContext<TData> = {
    selectedIds,
    get selectedRows() {
      return table.getSelectedRowModel().flatRows.map((row) => row.original)
    },
    clearSelection,
    exportCsv,
  }

  useImperativeHandle(
    ref,
    () => ({
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
      getSelectedRows: () =>
        table.getSelectedRowModel().flatRows.map((row) => row.original),
      scrollToRow: (id) => {
        if (virtualized) {
          const index = itemsRef.current.findIndex((item) => item.key === id)
          if (index >= 0) scrollToItemRef.current(index)
          return
        }
        tableRef.current
          ?.querySelector(`[data-row-key="${CSS.escape(id)}"]`)
          ?.scrollIntoView({ block: 'nearest' })
      },
    }),
    [table, bridge, exportCsv, clearSelection, virtualized, itemsRef],
  )

  const total = paginated ? table.getRowCount() : items.length
  // With children on their parent's page, a row's position overall isn't known from the page.
  const pageOffset =
    paginated && !hierarchical ? pagination.pageIndex * pagination.pageSize : 0
  const offscreenRows = hierarchical && paginated

  return (
    <DataTableContext.Provider value={context}>
      <div
        ref={rootRef}
        data-slot="data-table"
        data-density={density}
        className={cn(tDataTableClasses, className)}
      >
        <Toolbar
          table={table}
          search={search}
          canExport={canExport}
          onExport={() => void exportCsv()}
          extra={renderToolbar?.(toolbarContext)}
          end={
            hierarchical || hasDetail || columnsPanel ? (
              <>
                {columnsPanel ? <ColumnsPanel table={table} /> : null}
                {hierarchical || hasDetail ? (
                  <>
                    <TButton
                      variant="ghost"
                      size="sm"
                      onClick={() => table.toggleAllRowsExpanded(true)}
                    >
                      <TIcon icon={ChevronsUpDown} size="sm" />
                      {labels.expandAll}
                    </TButton>
                    <TButton
                      variant="ghost"
                      size="sm"
                      onClick={() => table.toggleAllRowsExpanded(false)}
                    >
                      <TIcon icon={ChevronsDownUp} size="sm" />
                      {labels.collapseAll}
                    </TButton>
                  </>
                ) : null}
              </>
            ) : undefined
          }
        />
        <FilterChips table={table} />
        {selectedIds.length ? (
          <BulkBar count={selectedIds.length} onClear={clearSelection}>
            {renderBulkActions?.(toolbarContext)}
          </BulkBar>
        ) : null}
        <div className={tDataTableViewportClasses}>
          <div
            ref={scrollerRef}
            data-slot="data-table-scroller"
            className={tDataTableScrollerClasses}
            style={{ maxHeight }}
          >
            <table
              ref={tableRef}
              role={hierarchical ? 'treegrid' : 'grid'}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              aria-rowcount={offscreenRows ? -1 : total + 1}
              aria-colcount={visibleColumns.length}
              aria-busy={loading || refetching || undefined}
              aria-multiselectable={selection === 'multiple' ? true : undefined}
              className={tDataTableTableClasses}
            >
              <Head
                table={table}
                headRef={headRef}
                sticky={stickyHeader}
                scope={scope}
              />
              <Body
                table={table}
                items={items}
                columnsKey={columnsKey}
                zebra={zebra}
                hover={hover}
                loading={loading}
                refetching={refetching}
                error={error}
                onRetry={onRetry}
                renderEmpty={renderEmpty}
                renderError={renderError}
                pageOffset={pageOffset}
                selectable={hasSelection}
                hierarchical={hierarchical}
                expanderColumnId={expanderColumnId}
                editing={editing}
                virtual={
                  virtualized
                    ? {
                        scrollerRef,
                        headerHeight,
                        estimateRowHeight:
                          virtualOptions.estimateRowHeight ??
                          TABLE_ROW_ESTIMATE[density],
                        overscan:
                          virtualOptions.overscan ?? TABLE_DEFAULT_OVERSCAN,
                        activeRowKey: () =>
                          gridRef.current?.getActiveRowKey() ?? null,
                        scrollToItemRef,
                      }
                    : undefined
                }
                onRendered={syncGrid}
              />
            </table>
          </div>
          {loading ? (
            <span role="status" className="sr-only">
              {labels.loading}
            </span>
          ) : null}
          {refetching ? (
            <div className={tDataTableRefreshClasses}>
              <TSpinner size="sm" aria-hidden />
              <span role="status">{labels.refreshing}</span>
            </div>
          ) : null}
        </div>
        {paginated ? (
          <Footer table={table} pageSizes={pageSizes} disabled={loading} />
        ) : null}
      </div>
    </DataTableContext.Provider>
  )
}
