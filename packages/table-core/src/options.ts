import { type Row, type TableOptions } from '@tanstack/table-core'
import {
  TABLE_DETAIL_COLUMN,
  TABLE_SELECT_COLUMN,
  withSyntheticPins,
} from './columns'
import { tableEngineFeatures, type TableEngineFeatures } from './features'
import { matchesTextFilter } from './filters'
import type {
  TableMode,
  TableRowData,
  TableSelectionMode,
  TableState,
} from './types'

export const DEFAULT_TABLE_PAGE_SIZES = [10, 25, 50, 100]

export interface TableEngineInput<TData> {
  mode: TableMode
  rowCount?: number
  getRowId: (row: TData, index: number, parentId?: string) => string
  getSubRows?: (row: TData) => TData[] | undefined
  canExpandRow?: (row: TData) => boolean
  detail: boolean
  selection: TableSelectionMode
  canSelectRow?: (row: TData) => boolean
  pagination: boolean
  rtl: boolean
  handlers: Record<string, (updater: unknown) => void>
}

export type TableEngineOptions<TData extends TableRowData> = Pick<
  TableOptions<TableEngineFeatures, TData>,
  | 'features'
  | 'getRowId'
  | 'getSubRows'
  | 'getRowCanExpand'
  | 'rowCount'
  | 'manualSorting'
  | 'manualFiltering'
  | 'manualPagination'
  | 'autoResetPageIndex'
  | 'autoResetExpanded'
  | 'paginateExpandedRows'
  | 'filterFromLeafRows'
  | 'enableRowSelection'
  | 'enableMultiRowSelection'
  | 'enableSubRowSelection'
  | 'enableGrouping'
  | 'columnResizeMode'
  | 'columnResizeDirection'
  | 'globalFilterFn'
  | 'getColumnCanGlobalFilter'
> &
  Record<string, unknown>

/**
 * Every engine option the table sets, in one place. Only this function decides them: the framework layers
 * add `data`, `columns` and `state`, and read the engine's rows, headers and cells.
 */
export function buildTableEngineOptions<TData extends TableRowData>(
  input: TableEngineInput<TData>,
): TableEngineOptions<TData> {
  const {
    mode,
    rowCount,
    getRowId,
    getSubRows,
    canExpandRow,
    detail,
    selection,
    canSelectRow,
    pagination,
    rtl,
    handlers,
  } = input
  const server = mode === 'server'
  return {
    features: tableEngineFeatures,
    getRowId: (row, index, parent) => getRowId(row, index, parent?.id),
    ...(getSubRows
      ? { getSubRows: (row: TData) => getSubRows(row) ?? [] }
      : {}),
    ...(detail || canExpandRow
      ? {
          getRowCanExpand: (row: Row<TableEngineFeatures, TData>) =>
            canExpandRow
              ? canExpandRow(row.original)
              : detail || row.subRows.length > 0,
        }
      : {}),
    ...(server ? { rowCount: rowCount ?? 0 } : {}),
    // Ascending first for every type; the engine's default starts numbers descending.
    sortDescFirst: false,
    manualSorting: server,
    manualFiltering: server,
    // Without a pager, the engine must not slice the rows.
    manualPagination: server || !pagination,
    // The table moves the page itself, on a filter or sort: a change of `data` (a saved edit, a refetch)
    // must not send the user back to the first page.
    autoResetPageIndex: false,
    autoResetExpanded: false,
    // Children stay on their parent's page, whatever their number.
    paginateExpandedRows: false,
    // A parent stays when a child matches, so a match is never left without its context.
    filterFromLeafRows: true,
    enableRowSelection: selection
      ? canSelectRow
        ? (row) => canSelectRow(row.original)
        : true
      : false,
    enableMultiRowSelection: selection === 'multiple',
    enableSubRowSelection: selection === 'multiple',
    // Groups need all the rows, which server mode doesn't have; and a tree already has its own hierarchy.
    enableGrouping: !server && !getSubRows,
    columnResizeMode: 'onChange',
    columnResizeDirection: rtl ? 'rtl' : 'ltr',
    globalFilterFn: (row, columnId, value) =>
      matchesTextFilter(row.getValue(columnId), value),
    // Instead of the engine's guess from the first row, whose value may be empty.
    getColumnCanGlobalFilter: () => true,
    ...handlers,
  }
}

/** What a table's props get wrong in a way it can still render, for a warning on the console. */
export function tableConfigWarnings(config: {
  mode: TableMode
  rowCount?: number
  virtualized: boolean
  hasMaxHeight: boolean
  tree: boolean
  detail: boolean
}): string[] {
  const warnings: string[] = []
  if (config.virtualized && !config.hasMaxHeight) {
    warnings.push(
      '`virtualized` needs `maxHeight`: without a bounded scroller, every row is in view.',
    )
  }
  if (config.mode === 'server' && config.rowCount === undefined) {
    warnings.push(
      'Server mode needs `rowCount`: the pager and the row range come from it.',
    )
  }
  if (config.tree && config.detail) {
    warnings.push(
      'A table has either sub-rows or a detail panel, as both use the same expanded state. The panel is ignored.',
    )
  }
  return warnings
}

/** The state a table starts with. */
export function buildTableInitialState(
  defaultState: Partial<TableState> | undefined,
  options: {
    selection: boolean
    detail: boolean
    pageSizes: readonly number[]
  },
): Partial<TableState> {
  return {
    ...defaultState,
    pagination: {
      pageIndex: 0,
      pageSize: options.pageSizes[0] ?? 10,
      ...defaultState?.pagination,
    },
    columnPinning: withSyntheticPins(defaultState?.columnPinning, options),
  }
}

/** Whether an engine column is one of the table's own (selection, detail). */
export function isSyntheticTableColumn(id: string): boolean {
  return id === TABLE_SELECT_COLUMN || id === TABLE_DETAIL_COLUMN
}

/**
 * The rows a CSV holds: every filtered and sorted row across pages, children under their parents, without
 * the group rows.
 */
export function collectTableExportRows<TData extends TableRowData>(
  rows: readonly Row<TableEngineFeatures, TData>[],
): TData[] {
  const result: TData[] = []
  const walk = (level: readonly Row<TableEngineFeatures, TData>[]) => {
    for (const row of level) {
      if (!row.getIsGrouped()) result.push(row.original)
      if (row.subRows.length) walk(row.subRows)
    }
  }
  walk(rows)
  return result
}
