import type {
  TableCellEdit,
  TableColumn,
  TableDensity,
  TableEditorType,
  TableHandle,
  TableLabels,
  TableMode,
  TableRowData,
  TableSelectionMode,
  TableState,
  TableStateKey,
} from '@repo/table-core'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode, Ref } from 'react'

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
  /** Give a control in the cell this tabIndex: the grid has one tab stop, and Enter or F2 reaches the control. */
  tabIndex: -1
}

export interface TDataTableEditorContext<TData, TValue = any> {
  value: TValue
  row: TData
  columnId: string
  commit: (value: unknown) => void
  cancel: () => void
}

export interface TDataTableColumn<TData, TValue = any> extends Omit<
  TableColumn<TData, TValue, LucideIcon>,
  'editor'
> {
  /** Replaces the title in the header. The title still names the column everywhere else. */
  header?: ReactNode | ((context: TDataTableHeaderContext) => ReactNode)
  /** Replaces the built-in rendering of `type`. */
  cell?: (context: TDataTableCellContext<TData, TValue>) => ReactNode
  /** A built-in editor by type, or your own. */
  editor?:
    | TableEditorType
    | ((context: TDataTableEditorContext<TData, TValue>) => ReactNode)
}

export interface TDataTableToolbarContext<TData> {
  selectedIds: string[]
  selectedRows: TData[]
  clearSelection: () => void
  exportCsv: () => Promise<void>
}

export interface TDataTableProps<TData extends TableRowData> {
  data: TData[]
  /** Keep the array stable (module scope or useMemo): a new one rebuilds the engine's columns. */
  columns: TDataTableColumn<TData, any>[]
  /** Identifies a row across sorting, paging and refetches: selection, expansion and focus follow it. */
  getRowId: (row: TData, index: number, parentId?: string) => string

  /** `server`: the caller sorts, filters and pages, reacting to `onStateChange`. */
  mode?: TableMode
  /** Number of rows on the server. Required in server mode. */
  rowCount?: number

  /** Slices set here are controlled; the rest live in the table. */
  state?: Partial<TableState>
  defaultState?: Partial<TableState>
  /** Called once per change, with the whole state and the names of the slices that changed. */
  onStateChange?: (state: TableState, changed: TableStateKey[]) => void

  selection?: TableSelectionMode
  canSelectRow?: (row: TData) => boolean
  /** What the header checkbox covers. Default: `all` in client mode, `page` in server mode. */
  selectAllScope?: 'page' | 'all'
  /** Children of a row, for tree data. A table has either these or `renderDetail`. */
  getSubRows?: (row: TData) => TData[] | undefined
  canExpandRow?: (row: TData) => boolean
  /** A panel under an open row, with its own height. */
  renderDetail?: (context: TDataTableRowContext<TData>) => ReactNode

  /** A search box over all columns. */
  search?: boolean
  /** Default: true. An object sets the page sizes offered. */
  pagination?: boolean | { pageSizes?: number[] }
  /** A panel to show, hide and move columns. */
  columnsPanel?: boolean
  /** An export button. `getRows` supplies the rows, for data the table doesn't hold. */
  csvExport?: boolean | { fileName?: string; getRows?: () => Promise<TData[]> }
  /** Called when an edit is committed. The table never changes `data`; a rejection keeps the editor open. */
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
  onRetry?: () => void

  /** Overrides any text the table shows or announces. */
  labels?: Partial<TableLabels>
  /** Formats numbers and dates. Default: the browser's. */
  locale?: string

  renderToolbar?: (context: TDataTableToolbarContext<TData>) => ReactNode
  renderBulkActions?: (context: TDataTableToolbarContext<TData>) => ReactNode
  renderEmpty?: () => ReactNode
  renderError?: (context: { error: unknown; retry?: () => void }) => ReactNode

  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
  ref?: Ref<TDataTableHandle<TData>>
}

export type TDataTableHandle<TData> = TableHandle<TData>
