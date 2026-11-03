import { TChart } from './TChart'
import type { TChartProps } from './types'

// A chart of one type: the same props as TChart, without `type`.
export type TPresetChartProps = Omit<TChartProps, 'type'>

export const TLineChart = (props: TPresetChartProps) => (
  <TChart {...props} type="line" />
)
export const TBarChart = (props: TPresetChartProps) => (
  <TChart {...props} type="bar" />
)
export const TPieChart = (props: TPresetChartProps) => (
  <TChart {...props} type="pie" />
)
