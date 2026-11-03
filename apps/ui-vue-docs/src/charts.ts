import { defineAsyncComponent } from 'vue'
import type { DocEntry, DocProp } from './catalog'

// The chart group's entries. One live demo, on TChart: the engine downloads only with it.
const ChartDemo = defineAsyncComponent(() => import('./demos/ChartDemo.vue'))

const chartProps: DocProp[] = [
  {
    name: 'series',
    type: 'ChartSeries[]',
    description:
      '{ id, name?, data, type?, color?, visible?, dashStyle?, marker?, stack? }. Matched by id: new data goes to that series in place. Keep data arrays stable.',
  },
  {
    name: 'categories',
    type: 'string[]',
    description: 'Category axis labels; a pie’s slice names.',
  },
  {
    name: 'x-axis / y-axis',
    type: 'ChartAxis',
    description: "{ title, min, max, format ('{value} %'), type }.",
  },
  {
    name: 'title / subtitle',
    type: 'string',
    description: 'The title also names the chart for screen readers.',
  },
  {
    name: 'caption',
    type: 'string',
    description:
      'A visible description under the chart, read by screen readers.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description:
      'The accessible name without a title. A chart with none of title, aria-label, caption warns.',
  },
  {
    name: 'stacking',
    type: "'normal' | 'percent'",
    description: 'Stacks the series (bars, columns, areas, lines).',
  },
  {
    name: 'legend',
    type: "boolean | 'top' | 'bottom' | 'right'",
    description: 'Unset: shown for a pie or more than one series.',
  },
  {
    name: 'tooltip',
    type: 'boolean | (point: ChartPointEvent) => string',
    description: 'false hides tooltips; a function returns their text.',
  },
  {
    name: 'value-format',
    type: '(value: number) => string',
    description: 'Formats y values: value axis, tooltip, data table.',
  },
  {
    name: 'colors',
    type: 'ChartColor[]',
    default: "'chart-1' … 'chart-8'",
    description:
      'Token names (chart-1…8, accent, info…) or CSS colours, in series order.',
  },
  {
    name: 'loading / loading-label',
    type: 'boolean / string',
    default: "false / 'Loading…'",
    description: 'An overlay over the chart.',
  },
  {
    name: 'empty-label',
    type: 'string',
    default: "'No data to display'",
    description: 'Shown when there is nothing to draw.',
  },
  {
    name: 'table',
    type: "'hidden' | 'visible' | 'none'",
    default: "'hidden'",
    description:
      'The data as a table: for screen readers only, shown under the chart, or none.',
  },
  {
    name: 'options',
    type: 'ChartOptions',
    description:
      'Raw engine options, deep-merged last: the escape hatch for what the props don’t cover.',
  },
]

const chartEvents: DocEntry['events'] = [
  {
    name: 'point-click / point-hover',
    payload: 'ChartPointEvent',
    description:
      '{ series: { id, name }, index, value, category, x, percentage }. Hover gets null when the pointer leaves.',
  },
  {
    name: 'series-toggle',
    payload: 'ChartToggleEvent',
    description:
      '{ series, name, visible, index? }: a legend click (a slice, in a pie).',
  },
  {
    name: 'load',
    payload: 'ChartInstance',
    description:
      'The engine’s chart was created (again after a type-family or colour change).',
  },
]

export const CHART_ENTRIES: DocEntry[] = [
  {
    id: 'chart',
    name: 'TChart',
    group: 'charts',
    summary:
      'A Highcharts chart filling its parent (give the parent a height): line, area, bar, column, pie or scatter. Prop changes update the chart in place; the page theme restyles it with no re-render. Import from @repo/ui-vue/charts.',
    props: [
      {
        name: 'type',
        type: "'line' | 'area' | 'bar' | 'column' | 'pie' | 'scatter'",
        description:
          'Between cartesian types the chart updates in place; to or from pie (or bar) it is re-created.',
      },
      ...chartProps,
    ],
    events: chartEvents,
    demo: ChartDemo,
    code: `<script setup lang="ts">
import { TChart } from '@repo/ui-vue/charts'
const sales = ref([
  { id: 'hardware', name: 'Hardware', data: [120, 90, 140, 80] },
  { id: 'software', name: 'Software', data: [60, 75, 50, 95] },
])
</script>

<template>
  <div class="h-72">
    <TChart
      type="column"
      title="Sales by region"
      :categories="['North', 'South', 'East', 'West']"
      :series="sales"
      stacking="normal"
      @point-click="({ series, category, value }) => (picked = \`\${series.name} \${category}: \${value}\`)"
    />
  </div>
</template>`,
  },
  {
    id: 'preset-charts',
    name: 'TLineChart',
    parts: ['TBarChart', 'TPieChart'],
    group: 'charts',
    summary:
      'TChart with its type fixed: the same props (without type) and events. For other types, use TChart.',
    props: [
      {
        name: '…',
        type: "Omit<TChartProps, 'type'>",
        description: 'Everything TChart takes, apart from type.',
      },
    ],
    code: `<TPieChart title="Share by region" :categories="regions" :series="[{ id: 'share', data: [30, 25, 20, 25] }]" />`,
  },
]
