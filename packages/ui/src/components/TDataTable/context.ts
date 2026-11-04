import type {
  TableEngineFeatures,
  TableLabels,
  TableRowData,
  TableState,
} from '@repo/table-core'
import type { Row, Table } from '@tanstack/react-table'
import { createContext, useContext } from 'react'
import type { TDataTableProps } from './types'

// `state` is what the adapter's selector picks: every slice but the sizes, which a drag changes per frame.
export type EngineTable<TData extends TableRowData> = Table<
  TableEngineFeatures,
  TData
> & { state: TableState }
export type EngineRow<TData extends TableRowData> = Row<
  TableEngineFeatures,
  TData
>

// Read by every row. The value changes only with what it holds, so a memoized row stays put otherwise.
export interface DataTableContextValue {
  labels: TableLabels
  locale?: string
  /** The caller's latest props, for callbacks and renderers. */
  latest: { current: TDataTableProps<any> }
  startEdit: (rowId: string, columnId: string) => void
  /** Ends an edit; `move` then takes the focus to the next or previous column. */
  finishEdit: (move?: 1 | -1) => void
}

export const DataTableContext = createContext<DataTableContextValue | null>(
  null,
)

export function useDataTableContext() {
  const context = useContext(DataTableContext)
  if (!context) throw new Error('A table part must be inside TDataTable')
  return context
}
