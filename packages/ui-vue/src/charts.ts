// The chart components (Highcharts), a separate entry so apps without a chart never bundle the engine.
// Their classes are in '@repo/ui-vue/styles.css'; the engine's colours come from the tokens, through a small
// stylesheet @repo/chart-core injects.
export { TBarChart, TChart, TLineChart, TPieChart } from './components/TChart'
export type { TChartProps, TPresetChartProps } from './components/TChart'
export type {
  ChartAxis,
  ChartColor,
  ChartDashStyle,
  ChartDatum,
  ChartInstance,
  ChartLegend,
  ChartMarker,
  ChartOptions,
  ChartPointEvent,
  ChartSeries,
  ChartSeriesRef,
  ChartToggleEvent,
  ChartTooltipFormatter,
  ChartType,
  ChartValueFormatter,
} from '@repo/chart-core'
