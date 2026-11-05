import type { UnknownAction } from '@reduxjs/toolkit'
import { ledgerCleared } from '../state/actions'
import { limitRemoved } from '../state/budgets'
import type { LedgerState } from '../state/ledger'
import { imported, removed } from '../state/transactions'
import { CATEGORIES } from './categories'

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

/**
 * The text of the Undo toast for a change worth one: deletes, imports, clearing and removing a budget.
 * Null for the rest (an add or an edit shows itself, and the header's Undo still reverts it).
 */
export function describeChange(
  action: UnknownAction,
  before: LedgerState,
): string | null {
  if (removed.match(action)) {
    const [id] = action.payload
    if (action.payload.length === 1 && id) {
      const transaction = before.transactions.entities[id]
      return transaction
        ? `Deleted “${transaction.description}”`
        : 'Deleted a transaction'
    }
    return `Deleted ${plural(action.payload.length, 'transaction')}`
  }
  if (imported.match(action)) {
    const { skipped, invalid } = action.meta
    return `${action.payload.length} imported, ${skipped} skipped, ${invalid} invalid`
  }
  if (ledgerCleared.match(action)) {
    return 'Cleared all transactions and budgets'
  }
  if (limitRemoved.match(action)) {
    return `Removed the ${CATEGORIES[action.payload].label} budget`
  }
  return null
}
