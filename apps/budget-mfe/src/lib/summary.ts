import type { CategoryId, ExpenseCategoryId, Transaction } from '../types'
import { addDays } from './dates'
import { fromCents, toCents } from './money'
import { type Bucket, bucketFinder, type Period } from './periods'

// The dashboard's numbers, as pure functions over transactions. Money is summed in whole cents.

export interface Totals {
  income: number
  expenses: number
  net: number
  /** Share of income not spent, -∞…1; null without income. */
  savingsRate: number | null
  count: number
}

function signedCents(transaction: Transaction): number {
  const cents = toCents(transaction.amount)
  return transaction.type === 'income' ? cents : -cents
}

export function totalsOf(transactions: readonly Transaction[]): Totals {
  let income = 0
  let expenses = 0
  for (const transaction of transactions) {
    if (transaction.type === 'income') income += toCents(transaction.amount)
    else expenses += toCents(transaction.amount)
  }
  return {
    income: fromCents(income),
    expenses: fromCents(expenses),
    net: fromCents(income - expenses),
    savingsRate: income > 0 ? (income - expenses) / income : null,
    count: transactions.length,
  }
}

/** The balance of everything dated on or before the day. */
export function balanceOn(transactions: readonly Transaction[], date: string): number {
  let cents = 0
  for (const transaction of transactions) {
    if (transaction.date <= date) cents += signedCents(transaction)
  }
  return fromCents(cents)
}

/** The change from one value to another as a share of the first; null when there is nothing to compare. */
export function relativeChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return (current - previous) / Math.abs(previous)
}

export interface CategorySpend {
  category: ExpenseCategoryId
  amount: number
  /** Of all expenses, 0…1. */
  share: number
}

/** Expenses by category, largest first; categories with nothing spent are left out. */
export function spendingByCategory(
  transactions: readonly Transaction[],
): CategorySpend[] {
  const cents = new Map<CategoryId, number>()
  let total = 0
  for (const transaction of transactions) {
    if (transaction.type !== 'expense') continue
    const amount = toCents(transaction.amount)
    cents.set(transaction.category, (cents.get(transaction.category) ?? 0) + amount)
    total += amount
  }
  return [...cents]
    .map(([category, amount]) => ({
      category: category as ExpenseCategoryId,
      amount: fromCents(amount),
      share: total === 0 ? 0 : amount / total,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export interface Cashflow {
  income: number[]
  expenses: number[]
}

/** Income and expenses per bucket, in bucket order. */
export function cashflowByBucket(
  transactions: readonly Transaction[],
  buckets: readonly Bucket[],
): Cashflow {
  const find = bucketFinder(buckets)
  const income = buckets.map(() => 0)
  const expenses = buckets.map(() => 0)
  for (const transaction of transactions) {
    const at = find(transaction.date)
    if (at === undefined) continue
    const list = transaction.type === 'income' ? income : expenses
    list[at]! += toCents(transaction.amount)
  }
  return { income: income.map(fromCents), expenses: expenses.map(fromCents) }
}

/** The balance at the end of each bucket: what came before the period, plus the period's running total. */
export function balanceByBucket(
  all: readonly Transaction[],
  period: Period,
  buckets: readonly Bucket[],
): number[] {
  const opening = toCents(balanceOn(all, addDays(period.start, -1)))
  const find = bucketFinder(buckets)
  const net = buckets.map(() => 0)
  for (const transaction of all) {
    if (transaction.date < period.start || transaction.date > period.end) continue
    const at = find(transaction.date)
    if (at !== undefined) net[at]! += signedCents(transaction)
  }
  let running = opening
  return net.map((cents) => fromCents((running += cents)))
}

/** The running savings rate across the buckets: smoother than each bucket's own, and defined sooner. */
export function savingsRateTrend(cashflow: Cashflow): (number | null)[] {
  let income = 0
  let expenses = 0
  return cashflow.income.map((amount, index) => {
    income += toCents(amount)
    expenses += toCents(cashflow.expenses[index] ?? 0)
    return income > 0 ? Math.round(((income - expenses) / income) * 1000) / 10 : null
  })
}

export interface TopSpending extends CategorySpend {
  /** Against the same category in the previous period; null when it had nothing then. */
  change: number | null
}

/** The category with the most spending, and how it moved since the previous period. */
export function topSpending(
  current: readonly CategorySpend[],
  previous: readonly CategorySpend[],
): TopSpending | null {
  const [top] = current
  if (!top) return null
  const before = previous.find((spend) => spend.category === top.category)
  return { ...top, change: before ? relativeChange(top.amount, before.amount) : null }
}

export type KpiId = 'balance' | 'income' | 'expenses' | 'savings'

export interface Kpi {
  id: KpiId
  label: string
  /** Money, or a rate (0…1) for savings; null when it can't be computed. */
  value: number | null
  kind: 'money' | 'rate'
  /** Balance: money gained in the period. Income, expenses: relative change. Savings: change in points. */
  delta: number | null
  deltaKind: 'money' | 'relative' | 'points'
  /** Whether a rise is good news (it isn't for expenses). */
  upIsGood: boolean
  trend: (number | null)[]
}

/** The four headline numbers of the period, each with its change and its trend. */
export function buildKpis({
  current,
  previous,
  closingBalance,
  openingBalance,
  cashflow,
  balanceTrend,
}: {
  current: Totals
  previous: Totals
  closingBalance: number
  openingBalance: number
  /** Per sparkline bucket. */
  cashflow: Cashflow
  /** Per sparkline bucket. */
  balanceTrend: number[]
}): Kpi[] {
  return [
    {
      id: 'balance',
      label: 'Balance',
      value: closingBalance,
      kind: 'money',
      delta: fromCents(toCents(closingBalance) - toCents(openingBalance)),
      deltaKind: 'money',
      upIsGood: true,
      trend: balanceTrend,
    },
    {
      id: 'income',
      label: 'Income',
      value: current.income,
      kind: 'money',
      delta: relativeChange(current.income, previous.income),
      deltaKind: 'relative',
      upIsGood: true,
      trend: cashflow.income,
    },
    {
      id: 'expenses',
      label: 'Expenses',
      value: current.expenses,
      kind: 'money',
      delta: relativeChange(current.expenses, previous.expenses),
      deltaKind: 'relative',
      upIsGood: false,
      trend: cashflow.expenses,
    },
    {
      id: 'savings',
      label: 'Savings rate',
      value: current.savingsRate,
      kind: 'rate',
      delta:
        current.savingsRate === null || previous.savingsRate === null
          ? null
          : current.savingsRate - previous.savingsRate,
      deltaKind: 'points',
      upIsGood: true,
      trend: savingsRateTrend(cashflow),
    },
  ]
}
