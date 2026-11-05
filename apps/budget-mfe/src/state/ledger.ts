import { combineReducers } from '@reduxjs/toolkit'
import type { LedgerSnapshot } from '../data/repository'
import type { Budget, ExpenseCategoryId } from '../types'
import { budgetsReducer } from './budgets'
import { loadLedger } from './thunks'
import { transactionsAdapter, transactionsReducer } from './transactions'
import { undoable } from './undo'

// The undoable part of the state: transactions and budgets share one history, so Undo always reverts the
// latest change, whichever it was. The ui slice stays outside it: undo never moves a filter or a dialog.
const ledgerContentReducer = combineReducers({
  transactions: transactionsReducer,
  budgets: budgetsReducer,
})

export type LedgerState = ReturnType<typeof ledgerContentReducer>

export const ledgerReducer = undoable(ledgerContentReducer, {
  limit: 50,
  resetOn: (action) => loadLedger.fulfilled.match(action),
})

/** The ledger as the repository stores it. */
export function toSnapshot(ledger: LedgerState): LedgerSnapshot {
  const { selectAll } = transactionsAdapter.getSelectors()
  return {
    transactions: selectAll(ledger.transactions),
    budgets: (
      Object.entries(ledger.budgets.limits) as [ExpenseCategoryId, number][]
    ).map(([category, monthlyLimit]): Budget => ({ category, monthlyLimit })),
  }
}
