import type { ExpenseCategoryId, Transaction } from '../types'
import { EXPENSE_CATEGORY_IDS } from './categories'
import { fromCents, toCents } from './money'

/** The status a budget's bar shows: well within, close to the limit, over it. */
export type BudgetTone = 'success' | 'warning' | 'danger'

/** From this share of the limit, a budget shows as close to it. */
export const NEAR_LIMIT = 0.8

export function budgetTone(spent: number, limit: number): BudgetTone {
  if (spent > limit) return 'danger'
  if (spent >= limit * NEAR_LIMIT) return 'warning'
  return 'success'
}

export interface BudgetProgress {
  category: ExpenseCategoryId
  spent: number
  /** Null when the category has no budget. */
  limit: number | null
  /** Left to spend; negative when over. Null without a budget. */
  remaining: number | null
  /** Spent as a share of the limit (may pass 1). Null without a budget. */
  ratio: number | null
  tone: BudgetTone | null
}

/** Every expense category's spending in the month ("2026-11"), against its limit if it has one. */
export function budgetProgress(
  transactions: readonly Transaction[],
  limits: Partial<Record<ExpenseCategoryId, number>>,
  month: string,
): BudgetProgress[] {
  const spent = new Map<string, number>()
  for (const transaction of transactions) {
    if (transaction.type !== 'expense' || !transaction.date.startsWith(month)) continue
    spent.set(
      transaction.category,
      (spent.get(transaction.category) ?? 0) + toCents(transaction.amount),
    )
  }
  return EXPENSE_CATEGORY_IDS.map((category) => {
    const amount = fromCents(spent.get(category) ?? 0)
    const limit = limits[category] ?? null
    return {
      category,
      spent: amount,
      limit,
      remaining: limit === null ? null : fromCents(toCents(limit) - toCents(amount)),
      ratio: limit === null ? null : amount / limit,
      tone: limit === null ? null : budgetTone(amount, limit),
    }
  })
}

export interface BudgetTotals {
  budgeted: number
  spent: number
  over: number
}

/** The month across the categories that have a budget. */
export function budgetTotals(progress: readonly BudgetProgress[]): BudgetTotals {
  let budgeted = 0
  let spent = 0
  let over = 0
  for (const item of progress) {
    if (item.limit === null) continue
    budgeted += toCents(item.limit)
    spent += toCents(item.spent)
    if (item.tone === 'danger') over++
  }
  return { budgeted: fromCents(budgeted), spent: fromCents(spent), over }
}
