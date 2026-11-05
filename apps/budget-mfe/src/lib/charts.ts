import type { ChartColor, ChartSeries } from '@repo/ui/charts'
import { CATEGORIES } from './categories'
import type { Bucket } from './periods'
import type { CategorySpend, Cashflow } from './summary'

// Chart props built from the summary. The selectors call these, so each result keeps its reference until
// the numbers change, and series ids never change: the chart controller updates series in place by id.
// Colours are palette tokens only: income and expenses take the first two (identity, not good or bad), and
// each category keeps its own slot, so a slice never changes colour when another one comes or goes.

export interface CartesianChartData {
  categories: string[]
  series: ChartSeries[]
}

export interface PieChartData {
  series: ChartSeries[]
  colors: ChartColor[]
}

export function cashflowChart(cashflow: Cashflow, buckets: readonly Bucket[]): CartesianChartData {
  return {
    categories: buckets.map((bucket) => bucket.label),
    series: [
      { id: 'income', name: 'Income', data: cashflow.income, color: 'chart-1' },
      { id: 'expenses', name: 'Expenses', data: cashflow.expenses, color: 'chart-2' },
    ],
  }
}

export function balanceChart(balance: number[], buckets: readonly Bucket[]): CartesianChartData {
  return {
    categories: buckets.map((bucket) => bucket.label),
    series: [{ id: 'balance', name: 'Balance', data: balance, color: 'chart-1' }],
  }
}

export function spendingChart(spending: readonly CategorySpend[]): PieChartData {
  return {
    series: [
      {
        id: 'spending',
        name: 'Spending',
        data: spending.map((spend) => ({
          id: spend.category,
          name: CATEGORIES[spend.category].label,
          y: spend.amount,
        })),
      },
    ],
    colors: spending.map((spend) => CATEGORIES[spend.category].color),
  }
}

/** One KPI's trend as a sparkline series. */
export function sparklineSeries(id: string, trend: (number | null)[]): ChartSeries[] {
  return [{ id, data: trend, color: 'fg-muted', marker: false }]
}
