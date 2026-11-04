// The public shapes of the data table. They name nothing from the engine, so emitted library types never
// depend on a package the apps don't list.

/** What a row can be. */
export type TableRowData = Record<string, any> | any[]

export type TableTone =
  'neutral' | 'accent' | 'success' | 'info' | 'warning' | 'danger'

export type TableColumnType =
  'text' | 'number' | 'date' | 'badge' | 'progress' | 'avatar' | 'actions'

export interface TableOption {
  value: string
  label: string
}

export interface TableRowAction<TIcon = unknown> {
  id: string
  label: string
  icon?: TIcon
  tone?: 'neutral' | 'danger'
  disabled?: boolean
  onSelect: () => void
}

/** A row comparison by name, or a function of the two original rows. */
export type TableSortFn<TData> =
  | 'auto'
  | 'alphanumeric'
  | 'basic'
  | 'datetime'
  | 'text'
  | ((a: TData, b: TData, columnId: string) => number)

/** A filter by value type. `fn` replaces the built-in test, with the same value. */
export type TableColumnFilter<TData> = (
  | { type: 'text'; placeholder?: string }
  | { type: 'numberRange'; min?: number; max?: number; step?: number }
  | { type: 'dateRange'; min?: string; max?: string }
  | {
      type: 'select' | 'multiSelect'
      /** Left out: taken from the rows, in client mode. */
      options?: TableOption[]
    }
) & { fn?: (row: TData, value: unknown) => boolean }

export type TableAggregate =
  'sum' | 'count' | 'min' | 'max' | 'mean' | 'median' | 'unique' | 'uniqueCount'

export type TableEditorType = 'text' | 'number' | 'date' | 'select'

export interface TableColumn<TData, TValue = unknown, TIcon = unknown> {
  /** Required unless `accessorKey` is given. It names the column in state, slots and URLs. */
  id?: string
  /** A key of the row; dots read nested values. */
  accessorKey?: (keyof TData & string) | (string & {})
  accessorFn?: (row: TData, index: number) => TValue
  /** Plain text for menus, chips, the CSV header and accessible names. */
  title: string
  type?: TableColumnType
  align?: 'start' | 'center' | 'end'
  width?: number
  minWidth?: number
  maxWidth?: number

  /** Default: true when the column has a value. */
  sortable?: boolean
  sortFn?: TableSortFn<TData>
  filter?: TableColumnFilter<TData>
  /** Default: true when the column has a value. Client mode only. */
  groupable?: boolean
  aggregate?: TableAggregate

  hideable?: boolean
  resizable?: boolean
  reorderable?: boolean
  pinnable?: boolean

  /** For `type: 'number'`. */
  number?: Intl.NumberFormatOptions
  /** For `type: 'date'`, whose values are ISO strings. */
  date?: Intl.DateTimeFormatOptions
  /** For `type: 'badge'`: a tone and a label by value. */
  badge?: {
    tones?: Record<string, TableTone>
    labels?: Record<string, string>
  }
  /** For `type: 'progress'`. */
  progress?: { max?: number; tone?: Exclude<TableTone, 'neutral'> }
  /** For `type: 'avatar'`. The cell's value is the name unless `name` is given. */
  avatar?: {
    name?: (row: TData) => string
    src?: (row: TData) => string | undefined
  }
  /** For `type: 'actions'`. */
  actions?: (row: TData) => TableRowAction<TIcon>[]

  editable?: boolean | ((row: TData) => boolean)
  editor?: TableEditorType
  editorOptions?: TableOption[]

  /** `false` leaves the column out of the CSV; a function replaces the raw value. */
  csv?: false | ((value: TValue, row: TData) => string)
}

/** What the helpers need of a column; each library's column type adds its renderers to the full shape. */
export type TableColumnData<TData, TValue = any> = Pick<
  TableColumn<TData, TValue, any>,
  'id' | 'accessorKey' | 'accessorFn' | 'title' | 'csv'
>

export interface TableSort {
  id: string
  desc: boolean
}

export interface TableColumnFilterValue {
  id: string
  value: unknown
}

export interface TablePagination {
  /** From 0, as the engine counts. */
  pageIndex: number
  pageSize: number
}

export interface TableColumnPinning {
  start: string[]
  end: string[]
}

export interface TableState {
  sorting: TableSort[]
  columnFilters: TableColumnFilterValue[]
  globalFilter: string
  pagination: TablePagination
  rowSelection: Record<string, true>
  expanded: Record<string, boolean> | true
  grouping: string[]
  columnVisibility: Record<string, boolean>
  columnOrder: string[]
  columnPinning: TableColumnPinning
  columnSizing: Record<string, number>
}

export type TableStateKey = keyof TableState

export interface TableNumberRange {
  min?: number
  max?: number
}

export interface TableDateRange {
  start?: string
  end?: string
}

export interface TableCellEdit<TData> {
  rowId: string
  row: TData
  columnId: string
  value: unknown
  previousValue: unknown
}

export type TableMode = 'client' | 'server'
export type TableSelectionMode = false | 'single' | 'multiple'
export type TableDensity = 'compact' | 'comfortable'

export interface TableHandle<TData> {
  getState(): TableState
  setState(next: Partial<TableState>): void
  exportCsv(): Promise<void>
  expandAll(): void
  collapseAll(): void
  clearFilters(): void
  clearSelection(): void
  getSelectedRows(): TData[]
  scrollToRow(id: string): void
}
