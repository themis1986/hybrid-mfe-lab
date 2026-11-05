import type { ChartOptions, ChartPointEvent } from '@repo/ui/charts'
import { CURRENCY, formatMoney } from '../../lib/money'

// Options shared by the dashboard's charts, at module scope so every render passes the same objects.

const WHOLE_MONEY = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
})

/** Axis labels and the data table: whole amounts. */
export const formatAxisMoney = (value: number) => WHOLE_MONEY.format(value)

/** Tooltips: the exact amount. */
export const moneyTooltip = (point: ChartPointEvent) =>
  `${point.category ?? ''}<br>${point.series.name}: <b>${formatMoney(point.value ?? 0)}</b>`

export const COLUMN_OPTIONS: ChartOptions = {
  plotOptions: { column: { borderRadius: 4, groupPadding: 0.12 } },
}

export const DONUT_OPTIONS: ChartOptions = {
  plotOptions: { pie: { innerSize: '64%', dataLabels: { enabled: false } } },
}
