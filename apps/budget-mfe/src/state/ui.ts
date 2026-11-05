import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { TablePagination, TableSort } from '@repo/ui/table'
import { today } from '../lib/dates'
import { EMPTY_FILTERS, type TransactionFilters } from '../lib/filter'
import { defaultPeriod, type Period } from '../lib/periods'
import type {
  CategoryId,
  ExpenseCategoryId,
  TransactionId,
  TransactionType,
} from '../types'
import { loadLedger } from './thunks'

/** Which dialog is open. One at a time, and only plain data: a dialog finds what it shows by id. */
export type DialogState =
  | { kind: 'transaction'; mode: 'new'; type?: TransactionType }
  | { kind: 'transaction'; mode: 'edit' | 'duplicate'; id: TransactionId }
  | { kind: 'confirm-delete'; ids: TransactionId[] }
  | { kind: 'budget'; category: ExpenseCategoryId }
  | { kind: 'confirm-clear' }
  | { kind: 'shortcuts' }

/** The table slices the app controls, so they survive a visit to another page. */
export interface TableView {
  sorting: TableSort[]
  pagination: TablePagination
  columnVisibility: Record<string, boolean>
}

export interface UiState {
  load: { status: 'loading' | 'ready' | 'error'; error: string | null }
  /** Drives every page: the dashboard, the list and the export of the current view. */
  period: Period
  filters: TransactionFilters
  table: TableView
  /** "2026-11": the month the budgets page shows. */
  budgetMonth: string
  dialog: DialogState | null
}

// A function, so "today" is read when a store is created (once per mount), not when the module loads.
function createInitialState(): UiState {
  const now = today()
  return {
    load: { status: 'loading', error: null },
    period: defaultPeriod(now),
    filters: EMPTY_FILTERS,
    table: {
      sorting: [{ id: 'date', desc: true }],
      pagination: { pageIndex: 0, pageSize: 25 },
      columnVisibility: { notes: false },
    },
    budgetMonth: now.slice(0, 7),
    dialog: null,
  }
}

// A new filter or period shows its first page; the table resets it itself only for its own controls.
function toFirstPage(state: UiState) {
  state.table.pagination.pageIndex = 0
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: createInitialState,
  reducers: {
    periodChanged(state, action: PayloadAction<Period>) {
      state.period = action.payload
      toFirstPage(state)
    },
    queryChanged(state, action: PayloadAction<string>) {
      state.filters.query = action.payload
      toFirstPage(state)
    },
    typeFilterChanged(state, action: PayloadAction<TransactionFilters['type']>) {
      state.filters.type = action.payload
      toFirstPage(state)
    },
    categoryFilterChanged(state, action: PayloadAction<CategoryId[]>) {
      state.filters.categories = action.payload
      toFirstPage(state)
    },
    filtersCleared(state) {
      state.filters = EMPTY_FILTERS
      toFirstPage(state)
    },
    tableViewChanged(state, action: PayloadAction<Partial<TableView>>) {
      Object.assign(state.table, action.payload)
    },
    budgetMonthChanged(state, action: PayloadAction<string>) {
      state.budgetMonth = action.payload
    },
    dialogOpened(state, action: PayloadAction<DialogState>) {
      state.dialog = action.payload
    },
    dialogClosed(state) {
      state.dialog = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLedger.pending, (state) => {
        state.load = { status: 'loading', error: null }
      })
      .addCase(loadLedger.fulfilled, (state) => {
        state.load = { status: 'ready', error: null }
      })
      .addCase(loadLedger.rejected, (state, action) => {
        // An aborted load belongs to a mount that has ended or a load that was replaced.
        if (action.meta.aborted) return
        state.load = {
          status: 'error',
          error: action.error.message ?? 'Unknown error',
        }
      })
  },
})

export const {
  periodChanged,
  queryChanged,
  typeFilterChanged,
  categoryFilterChanged,
  filtersCleared,
  tableViewChanged,
  budgetMonthChanged,
  dialogOpened,
  dialogClosed,
} = uiSlice.actions
export const uiReducer = uiSlice.reducer
