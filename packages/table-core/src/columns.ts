import type { ColumnDef } from '@tanstack/table-core'
import type { TableColumnMeta, TableEngineFeatures } from './features'
import { isTableFilterEmpty, toEngineFilterFn } from './filters'
import type {
  TableColumn,
  TableColumnData,
  TableColumnType,
  TableRowData,
  TableSortFn,
} from './types'

export const TABLE_SELECT_COLUMN = '__select'
export const TABLE_DETAIL_COLUMN = '__detail'

const DEFAULT_WIDTH: Record<TableColumnType, number> = {
  text: 180,
  number: 120,
  date: 140,
  badge: 130,
  progress: 170,
  avatar: 220,
  actions: 64,
}

export function tableColumnId(column: TableColumnData<any>): string {
  const id = column.id ?? column.accessorKey
  if (!id) {
    throw new Error(
      `A table column needs an id or an accessorKey: "${column.title}"`,
    )
  }
  return id
}

/** Reads a row's value for a column: `accessorFn`, or a key whose dots read nested values. */
export function getTableColumnValue<TData>(
  column: TableColumnData<TData>,
  row: TData,
  index: number,
): unknown {
  if (column.accessorFn) return column.accessorFn(row, index)
  const key = column.accessorKey
  if (!key) return undefined
  if (!key.includes('.')) return (row as Record<string, unknown>)[key]
  let value: unknown = row
  for (const part of key.split('.')) {
    if (value === null || value === undefined) return undefined
    value = (value as Record<string, unknown>)[part]
  }
  return value
}

function hasValue(column: TableColumn<any, any, any>): boolean {
  return Boolean(column.accessorFn || column.accessorKey)
}

function engineSortFn<TData>(column: TableColumn<TData, any, any>): unknown {
  const sortFn: TableSortFn<TData> | undefined = column.sortFn
  if (typeof sortFn === 'function') {
    return (a: { original: TData }, b: { original: TData }, id: string) =>
      sortFn(a.original, b.original, id)
  }
  if (sortFn) return sortFn
  // ISO dates and numbers compare directly, much faster than the natural-order sort on large tables.
  switch (column.type) {
    case 'number':
    case 'progress':
    case 'date':
      return 'basic'
    default:
      return 'auto'
  }
}

export interface ToColumnDefsOptions {
  selection: boolean
  detail: boolean
}

/** The engine's columns for our definitions, plus the selection and detail columns the table adds. */
export function toColumnDefs<TData extends TableRowData>(
  columns: readonly TableColumn<TData, any, any>[],
  { selection, detail }: ToColumnDefsOptions,
): ColumnDef<TableEngineFeatures, TData, any>[] {
  const defs: ColumnDef<TableEngineFeatures, TData, any>[] = []
  const synthetic = (
    id: string,
    kind: 'select' | 'detail',
    index: number,
  ): ColumnDef<TableEngineFeatures, TData, any> => ({
    id,
    header: '',
    size: 44,
    minSize: 44,
    maxSize: 44,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    enablePinning: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableGrouping: false,
    meta: { index, synthetic: kind } satisfies TableColumnMeta,
  })

  let index = columns.length
  if (selection) defs.push(synthetic(TABLE_SELECT_COLUMN, 'select', index++))
  if (detail) defs.push(synthetic(TABLE_DETAIL_COLUMN, 'detail', index++))

  columns.forEach((column, position) => {
    const id = tableColumnId(column)
    const withValue = hasValue(column)
    const type = column.type ?? 'text'
    const filter = column.filter
    const filterFn = filter && toEngineFilterFn(filter)
    if (filterFn) {
      ;(filterFn as { autoRemove?: (value: unknown) => boolean }).autoRemove =
        isTableFilterEmpty
    }
    defs.push({
      id,
      header: column.title,
      ...(withValue
        ? {
            accessorFn: (row: TData, index: number) =>
              getTableColumnValue(column, row, index),
          }
        : {}),
      size: column.width ?? DEFAULT_WIDTH[type],
      minSize: column.minWidth ?? Math.min(60, column.width ?? 60),
      maxSize: column.maxWidth ?? 1200,
      enableSorting: column.sortable ?? (withValue && type !== 'actions'),
      sortFn: engineSortFn(column) as never,
      sortUndefined: 'last',
      enableColumnFilter: Boolean(filter),
      ...(filterFn ? { filterFn: filterFn as never } : {}),
      enableGlobalFilter: withValue && type !== 'actions',
      enableGrouping: column.groupable ?? (withValue && type !== 'actions'),
      ...(column.aggregate ? { aggregationFn: column.aggregate as never } : {}),
      enableHiding: column.hideable ?? true,
      enableResizing: column.resizable ?? true,
      enablePinning: column.pinnable ?? true,
      meta: { spec: column, index: position } satisfies TableColumnMeta,
    } as ColumnDef<TableEngineFeatures, TData, any>)
  })
  return defs
}

/** The table's own columns stay at the start, and always pinned. */
export function withSyntheticPins(
  pinning: { start?: string[]; end?: string[] } | undefined,
  { selection, detail }: ToColumnDefsOptions,
): { start: string[]; end: string[] } {
  const pinned: string[] = []
  if (selection) pinned.push(TABLE_SELECT_COLUMN)
  if (detail) pinned.push(TABLE_DETAIL_COLUMN)
  const start = (pinning?.start ?? []).filter(
    (id) => id !== TABLE_SELECT_COLUMN && id !== TABLE_DETAIL_COLUMN,
  )
  return { start: [...pinned, ...start], end: pinning?.end ?? [] }
}
