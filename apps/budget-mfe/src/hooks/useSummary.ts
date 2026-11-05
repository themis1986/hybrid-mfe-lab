import { useAppSelector } from '../state/hooks'
import {
  selectBalanceChart,
  selectCashflowChart,
  selectCategorySpending,
  selectKpis,
  selectSpendingChart,
  selectTopSpending,
} from '../state/selectors'

/**
 * The dashboard's numbers and chart data for the period. Every value comes from a memoised selector, so it
 * keeps its reference until the data or the period changes, and a chart receives the same series.
 */
export function useSummary() {
  return {
    kpis: useAppSelector(selectKpis),
    spending: useAppSelector(selectCategorySpending),
    topSpending: useAppSelector(selectTopSpending),
    spendingChart: useAppSelector(selectSpendingChart),
    cashflowChart: useAppSelector(selectCashflowChart),
    balanceChart: useAppSelector(selectBalanceChart),
  }
}
