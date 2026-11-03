import type {
  ChartAxis,
  ChartColor,
  ChartLegend,
  ChartOptions,
  ChartSeries,
  ChartTooltipFormatter,
  ChartType,
  ChartValueFormatter,
} from '@repo/chart-core'

// Events: point-click (ChartPointEvent), point-hover (ChartPointEvent, or null once the pointer leaves),
// series-toggle (ChartToggleEvent: a legend click shows or hides a series, a slice in a pie), and load
// (the engine's chart, again after a type or colour change). Exposed: getChart().
export interface TChartProps {
  type: ChartType
  /** Matched by id on every change: data updates go to that series in place. */
  series: ChartSeries[]
  categories?: string[]
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  title?: string
  subtitle?: string
  /** A visible description under the chart, also read by screen readers. */
  caption?: string
  /** The accessible name when there is no title. A chart without title, aria label or caption warns. */
  ariaLabel?: string
  stacking?: 'normal' | 'percent'
  /** Unset: shown for a pie or more than one series. */
  legend?: ChartLegend
  /** false hides tooltips; a function returns their text (markup is limited by the engine). */
  tooltip?: boolean | ChartTooltipFormatter
  /** Formats y values: value axis, default tooltip, data table. */
  valueFormat?: ChartValueFormatter
  /** Series colours in order: token names ('chart-1'…'chart-8', 'accent'…) or CSS colours. */
  colors?: ChartColor[]
  loading?: boolean
  loadingLabel?: string
  emptyLabel?: string
  /** The data table: for screen readers only (default), shown under the chart, or none. */
  table?: 'hidden' | 'visible' | 'none'
  /** Raw engine options, deep-merged last. */
  options?: ChartOptions
}
