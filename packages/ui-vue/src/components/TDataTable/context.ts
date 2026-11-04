import type { TableEngineFeatures, TableLabels } from '@repo/table-core'
import type { Cell, Column, Header, Row, Table } from '@tanstack/vue-table'
import {
  type ComputedRef,
  inject,
  type InjectionKey,
  type Ref,
  type Slots,
} from 'vue'

export type EngineTable = Table<TableEngineFeatures, any>
export type EngineRow = Row<TableEngineFeatures, any>
export type EngineCell = Cell<TableEngineFeatures, any, any>
export type EngineColumn = Column<TableEngineFeatures, any, any>
export type EngineHeader = Header<TableEngineFeatures, any, any>

export interface DataTableContext {
  labels: ComputedRef<TableLabels>
  locale: ComputedRef<string | undefined>
  /** The caller's slots: cells, headers and the detail panel render them from deep inside. */
  slots: Slots
  /** Called when an edit is committed. */
  onCellEdit: () => ((edit: any) => void | Promise<void>) | undefined
  editing: Ref<{ rowId: string; columnId: string } | null>
  startEdit: (rowId: string, columnId: string) => void
  /** Ends an edit; `move` then takes the focus to the next or previous column. */
  finishEdit: (move?: 1 | -1) => void
}

export const dataTableContextKey: InjectionKey<DataTableContext> =
  Symbol('t-data-table')

export function useDataTableContext() {
  const context = inject(dataTableContextKey)
  if (!context) throw new Error('A table part must be inside TDataTable')
  return context
}
