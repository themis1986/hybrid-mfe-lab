import { createSelector } from '@reduxjs/toolkit'
import { filterTransactions, inPeriodOnly } from '../lib/filter'
import type { RootState } from './store'
import { transactionsAdapter } from './transactions'

// Reads of the state. Anything derived is memoised with createSelector over pure functions in src/lib, so it
// keeps its reference until its inputs change: the table's data and the charts' series rely on that.

export const {
  selectAll: selectAllTransactions,
  selectById: selectTransactionById,
  selectTotal: selectTransactionCount,
} = transactionsAdapter.getSelectors(
  (state: RootState) => state.ledger.present.transactions,
)

export const selectBudgetLimits = (state: RootState) =>
  state.ledger.present.budgets.limits
export const selectLoad = (state: RootState) => state.ui.load
export const selectPeriod = (state: RootState) => state.ui.period
export const selectFilters = (state: RootState) => state.ui.filters
export const selectTableView = (state: RootState) => state.ui.table
export const selectBudgetMonth = (state: RootState) => state.ui.budgetMonth
export const selectDialog = (state: RootState) => state.ui.dialog
export const selectCanUndo = (state: RootState) => state.ledger.past.length > 0
export const selectCanRedo = (state: RootState) =>
  state.ledger.future.length > 0

/** The transactions in the period, newest first. */
export const selectPeriodTransactions = createSelector(
  [selectAllTransactions, selectPeriod],
  inPeriodOnly,
)

/** What the transactions table shows and "export the current view" writes: the period, then the filters. */
export const selectVisibleTransactions = createSelector(
  [selectPeriodTransactions, selectFilters],
  filterTransactions,
  // Without filters this hands back its input on purpose, so the table keeps the same array.
  { devModeChecks: { identityFunctionCheck: 'never' } },
)
