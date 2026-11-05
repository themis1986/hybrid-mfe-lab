import { createSelector } from '@reduxjs/toolkit'
import { budgetProgress, budgetTotals } from '../lib/budgets'
import { balanceChart, cashflowChart, spendingChart } from '../lib/charts'
import { addDays } from '../lib/dates'
import { filterTransactions, inPeriodOnly } from '../lib/filter'
import { bucketsOf, previousPeriod, fineBucketsOf } from '../lib/periods'
import {
  balanceByBucket,
  balanceOn,
  buildKpis,
  cashflowByBucket,
  spendingByCategory,
  topSpending,
  totalsOf,
} from '../lib/summary'
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

// The dashboard. Each step is memoised on its own inputs, so a change of the period recomputes the series
// but not the budget progress, and a dialog opening recomputes nothing.

export const selectPreviousPeriodTransactions = createSelector(
  [selectAllTransactions, selectPeriod],
  (all, period) => inPeriodOnly(all, previousPeriod(period)),
)

export const selectBuckets = createSelector([selectPeriod], bucketsOf)

export const selectCategorySpending = createSelector(
  [selectPeriodTransactions],
  spendingByCategory,
)

const selectPreviousCategorySpending = createSelector(
  [selectPreviousPeriodTransactions],
  spendingByCategory,
)

export const selectCashflow = createSelector(
  [selectPeriodTransactions, selectBuckets],
  cashflowByBucket,
)


// Trends (the balance chart, the KPI sparklines) use finer buckets than the cash-flow columns, so they have
// enough points to read as a trend.
const selectFineBuckets = createSelector([selectPeriod], fineBucketsOf)

const selectSparklineCashflow = createSelector(
  [selectPeriodTransactions, selectFineBuckets],
  cashflowByBucket,
)

export const selectBalanceTrend = createSelector(
  [selectAllTransactions, selectPeriod, selectFineBuckets],
  balanceByBucket,
)

export const selectKpis = createSelector(
  [
    selectAllTransactions,
    selectPeriod,
    selectPeriodTransactions,
    selectPreviousPeriodTransactions,
    selectSparklineCashflow,
    selectBalanceTrend,
  ],
  (all, period, current, previous, cashflow, balanceTrend) =>
    buildKpis({
      current: totalsOf(current),
      previous: totalsOf(previous),
      closingBalance: balanceOn(all, period.end),
      openingBalance: balanceOn(all, addDays(period.start, -1)),
      cashflow,
      balanceTrend,
    }),
)

export const selectTopSpending = createSelector(
  [selectCategorySpending, selectPreviousCategorySpending],
  topSpending,
)

export const selectCashflowChart = createSelector(
  [selectCashflow, selectBuckets],
  cashflowChart,
)

export const selectBalanceChart = createSelector(
  [selectBalanceTrend, selectFineBuckets],
  balanceChart,
)

export const selectSpendingChart = createSelector(
  [selectCategorySpending],
  spendingChart,
)

// Budgets: the month the budgets page shows.

export const selectBudgetProgress = createSelector(
  [selectAllTransactions, selectBudgetLimits, selectBudgetMonth],
  budgetProgress,
)

export const selectBudgetTotals = createSelector(
  [selectBudgetProgress],
  budgetTotals,
)
