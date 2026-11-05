import type { Budget, Transaction } from '../types'

/** Everything the app keeps: what undo and redo move between, and what a backend would store. */
export interface LedgerSnapshot {
  transactions: Transaction[]
  budgets: Budget[]
}

// Where the ledger lives. Async on purpose, so a backend can replace the in-memory version without
// touching the store or the components.
export interface BudgetRepository {
  load(signal: AbortSignal): Promise<LedgerSnapshot>
  save(snapshot: LedgerSnapshot): Promise<void>
}
