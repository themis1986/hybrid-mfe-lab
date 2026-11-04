import {
  buildTableEngineOptions,
  buildTableInitialState,
  collectTableExportRows,
  createTableStateBridge,
  DEFAULT_TABLE_PAGE_SIZES,
  downloadCsv,
  mergeTableLabels,
  tableConfigWarnings,
  type TableColumn,
  type TableEngineFeatures,
  type TableRowData,
  toColumnDefs,
  toCsv,
  withSyntheticPins,
} from '@repo/table-core'
import { useTable } from '@tanstack/react-table'
import {
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useLatest } from '../../lib/latest'
import type { TDataTableProps } from './types'

export function useDataTable<TData extends TableRowData>(
  props: TDataTableProps<TData>,
  rootRef: RefObject<HTMLElement | null>,
) {
  const {
    data,
    columns,
    mode = 'client',
    rowCount,
    state,
    defaultState,
    selection = false,
    getSubRows,
    canExpandRow,
    canSelectRow,
    renderDetail,
    pagination = true,
    labels: labelOverrides,
    csvExport,
  } = props
  const latest = useLatest(props)
  const hasSelection = Boolean(selection)
  const hasDetail = Boolean(renderDetail) && !getSubRows
  const hasTree = Boolean(getSubRows)
  const hasPicker = Boolean(canExpandRow)
  const hasCanSelect = Boolean(canSelectRow)
  const paginated = Boolean(pagination)
  const pageSizes =
    (typeof pagination === 'object' && pagination.pageSizes) ||
    DEFAULT_TABLE_PAGE_SIZES

  useEffect(() => {
    const warnings = tableConfigWarnings({
      mode,
      rowCount,
      virtualized: Boolean(latest.current.virtualized),
      hasMaxHeight: latest.current.maxHeight !== undefined,
      tree: hasTree,
      detail: Boolean(latest.current.renderDetail),
    })
    for (const warning of warnings) console.warn(`[TDataTable] ${warning}`)
    // Once per table: on later renders these would only repeat.
  }, [])

  const [rtl, setRtl] = useState(false)
  useLayoutEffect(() => {
    if (!rootRef.current) return
    setRtl(getComputedStyle(rootRef.current).direction === 'rtl')
  })

  const [bridge] = useState(() =>
    createTableStateBridge({
      getControlled: () => latest.current.state,
      onChange: () => latest.current.onStateChange,
    }),
  )

  const synthetic = useMemo(
    () => ({ selection: hasSelection, detail: hasDetail }),
    [hasSelection, hasDetail],
  )
  const columnDefs = useMemo(
    () => toColumnDefs(columns as TableColumn<TData, any, any>[], synthetic),
    [columns, synthetic],
  )
  const engineOptions = useMemo(
    () =>
      buildTableEngineOptions<TData>({
        mode,
        rowCount,
        getRowId: (row, index, parentId) =>
          latest.current.getRowId(row, index, parentId),
        getSubRows: hasTree
          ? (row) => latest.current.getSubRows?.(row)
          : undefined,
        canExpandRow: hasPicker
          ? (row) => latest.current.canExpandRow?.(row) ?? false
          : undefined,
        detail: hasDetail,
        selection,
        canSelectRow: hasCanSelect
          ? (row) => latest.current.canSelectRow?.(row) ?? false
          : undefined,
        pagination: paginated,
        rtl,
        handlers: bridge.handlers,
      }),
    [
      mode,
      rowCount,
      hasTree,
      hasPicker,
      hasDetail,
      selection,
      hasCanSelect,
      paginated,
      rtl,
      bridge,
      latest,
    ],
  )
  const engineState = useMemo(
    () =>
      bridge.toEngineState(state, (pinning) =>
        withSyntheticPins(pinning, synthetic),
      ),
    [bridge, state, synthetic],
  )
  const [initialState] = useState(() =>
    buildTableInitialState(defaultState, {
      ...synthetic,
      pageSizes,
    }),
  )

  // A resize drag's sizes stay out of the selection: the CSS variables follow them without a render.
  const table = useTable(
    {
      ...engineOptions,
      data,
      columns: columnDefs,
      state: engineState,
      initialState,
    } as Parameters<typeof useTable<TableEngineFeatures, TData>>[0],
    ({ columnSizing: _sizing, columnResizing: _resizing, ...rest }) => rest,
  )
  bridge.bind(table as never)
  useEffect(() => {
    bridge.bind(table as never)
    return () => bridge.destroy()
  }, [bridge, table])

  const labels = useMemo(
    () => mergeTableLabels(labelOverrides),
    [labelOverrides],
  )

  const exportCsv = useCallback(async () => {
    const { csvExport: exportOptions, mode: currentMode } = latest.current
    const options = typeof exportOptions === 'object' ? exportOptions : {}
    const rows = options.getRows
      ? await options.getRows()
      : currentMode === 'server'
        ? latest.current.data
        : collectTableExportRows(table.getSortedRowModel().rows)
    const visible = table
      .getVisibleLeafColumns()
      .flatMap((column) => column.columnDef.meta?.spec ?? [])
    downloadCsv(toCsv(rows, visible), options.fileName)
  }, [latest, table])

  return {
    table,
    bridge,
    labels,
    pageSizes,
    exportCsv,
    hasSelection,
    hasDetail,
    hasTree,
    paginated,
    server: mode === 'server',
    canExport: Boolean(csvExport),
  }
}
