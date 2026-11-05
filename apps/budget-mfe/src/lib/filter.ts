import type { CategoryId, Transaction, TransactionType } from '../types'
import { CATEGORIES } from './categories'
import { inPeriod, type Period } from './periods'

/** The filters of the transactions view. The period is separate: it drives every page. */
export interface TransactionFilters {
  query: string
  type: 'all' | TransactionType
  categories: CategoryId[]
}

export const EMPTY_FILTERS: TransactionFilters = {
  query: '',
  type: 'all',
  categories: [],
}

export function isFiltering(filters: TransactionFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.type !== 'all' ||
    filters.categories.length > 0
  )
}

export function inPeriodOnly(
  transactions: readonly Transaction[],
  period: Period,
): Transaction[] {
  return transactions.filter((transaction) =>
    inPeriod(transaction.date, period),
  )
}

function matchesQuery(transaction: Transaction, query: string): boolean {
  return [
    transaction.description,
    transaction.notes ?? '',
    CATEGORIES[transaction.category].label,
    transaction.amount.toFixed(2),
  ].some((text) => text.toLowerCase().includes(query))
}

/**
 * The transactions the filters let through. Without active filters it returns the list itself, so a
 * memoised selector keeps handing the table the same array.
 */
export function filterTransactions<T extends readonly Transaction[]>(
  transactions: T,
  filters: TransactionFilters,
): T | Transaction[] {
  if (!isFiltering(filters)) return transactions
  const query = filters.query.trim().toLowerCase()
  const categories = new Set(filters.categories)
  return transactions.filter(
    (transaction) =>
      (filters.type === 'all' || transaction.type === filters.type) &&
      (categories.size === 0 || categories.has(transaction.category)) &&
      (query === '' || matchesQuery(transaction, query)),
  )
}
