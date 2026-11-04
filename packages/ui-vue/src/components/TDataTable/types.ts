import type {
  TableCellEdit,
  TableColumn,
  TableDensity,
  TableHandle,
  TableLabels,
  TableMode,
  TableRowData,
  TableSelectionMode,
  TableState,
} from '@repo/table-core'
import type { Component } from 'vue'

export interface TDataTableHeaderContext {
  columnId: string
  title: string
}

export interface TDataTableRowContext<TData> {
  row: TData
  rowId: string
  depth: number
  isSelected: boolean
  isExpanded: boolean
  canExpand: boolean
  toggleExpanded: () => void
}

export interface TDataTableCellContext<
  TData,
  TValue = any,
> extends TDataTableRowContext<TData> {
  value: TValue
  columnId: string
  startEdit: () => void
  /** Give a control in the cell this tabindex: the grid has one tab stop, and Enter or F2 reaches the control. */
  tabIndex: -1
}

export interface TDataTableEditorContext<TData, TValue = any> {
  value: TValue
  row: TData
  columnId: string
  commit: (value: unknown) => void
  cancel: () => void
}

/** Plain data: header, cell and editor renderers are the table's `#header-<id>`, `#cell-<id>` and `#editor-<id>` slots. */
export type TDataTableColumn<TData, TValue = any> = TableColumn<
  TData,
  TValue,
  Component
>

export interface TDataTableToolbarContext<TData> {
  selectedIds: string[]
  selectedRows: TData[]
  clearSelection: () => void
  exportCsv: () => Promise<void>
}

export interface TDataTableProps<TData extends TableRowData> {
  /** Replace the array to change it: the table reads it raw, so large data is never deep-proxied. */
  data: TData[]
  /** Keep the array stable: a new one rebuilds the engine's columns. */
  columns: TDataTableColumn<TData, any>[]
  /** Identifies a row across sorting, paging and refetches: selection, expansion and focus follow it. */
  getRowId: (row: TData, index: number, parentId?: string) => string

  /** `server`: the caller sorts, filters and pages, reacting to the state's changes. */
  mode?: TableMode
  /** Number of rows on the server. Required in server mode. */
  rowCount?: number

  /** The state a table starts with. Slices bound through `v-model:state` are controlled. */
  defaultState?: Partial<TableState>

  selection?: TableSelectionMode
  canSelectRow?: (row: TData) => boolean
  /** What the header checkbox covers. Default: `all` in client mode, `page` in server mode. */
  selectAllScope?: 'page' | 'all'
  /** Children of a row, for tree data. A table has either these or a `#detail` slot. */
  getSubRows?: (row: TData) => TData[] | undefined
  canExpandRow?: (row: TData) => boolean

  /** A search box over all columns. */
  search?: boolean
  /** Default: true. An object sets the page sizes offered. */
  pagination?: boolean | { pageSizes?: number[] }
  /** A panel to show, hide and move columns. */
  columnsPanel?: boolean
  /** An export button. `getRows` supplies the rows, for data the table doesn't hold. */
  csvExport?: boolean | { fileName?: string; getRows?: () => Promise<TData[]> }
  /**
   * Called when an edit is committed. The table never changes `data`; a rejection keeps the editor open. A
   * prop rather than an event, because an event can't return that promise.
   */
  onCellEdit?: (edit: TableCellEdit<TData>) => void | Promise<void>

  density?: TableDensity
  zebra?: boolean
  /** Highlights the row under the pointer. Default: true. */
  hover?: boolean
  /** Default: true. It sticks within the table's scroller, so it needs `maxHeight` to have an effect. */
  stickyHeader?: boolean
  /** Bounds the scroller. */
  maxHeight?: number | string
  /** Renders only the rows in view. Needs `maxHeight`. */
  virtualized?: boolean | { estimateRowHeight?: number; overscan?: number }

  /** First load: skeleton rows. */
  loading?: boolean
  /** Reload: the rows stay, under an indicator. */
  refetching?: boolean
  error?: unknown

  /** Overrides any text the table shows or announces. */
  labels?: Partial<TableLabels>
  /** Formats numbers and dates. Default: the browser's. */
  locale?: string
}

export type TDataTableHandle<TData> = TableHandle<TData>
