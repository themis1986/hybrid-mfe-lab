import type { ChartType } from '@repo/chart-core'
import { type Component, type DefineComponent, defineComponent, h } from 'vue'
import TChart from './TChart.vue'
import type { TChartProps } from './types'

// A chart of one type: the same props and events as TChart, without `type`. Attributes pass through
// untouched, so TChart applies its own defaults.
export type TPresetChartProps = Omit<TChartProps, 'type'>

const preset = (name: string, type: ChartType) =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup:
      (_, { attrs }) =>
      () =>
        h(TChart as Component, { ...attrs, type }),
  }) as unknown as DefineComponent<TPresetChartProps>

export const TLineChart = preset('TLineChart', 'line')
export const TBarChart = preset('TBarChart', 'bar')
export const TPieChart = preset('TPieChart', 'pie')
