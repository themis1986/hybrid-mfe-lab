<script setup lang="ts">
import {
  ChartController,
  type ChartHandlers,
  type ChartInstance,
  type ChartPointEvent,
  type ChartSpec,
  chartTable,
  type ChartToggleEvent,
  validateSpec,
} from '@repo/chart-core'
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  toRaw,
  watch,
} from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { useListeners } from '../../lib/listeners'
import {
  tChartCanvasClasses,
  tChartClasses,
  tChartMessageClasses,
  tChartTableCaptionClasses,
  tChartTableCellClasses,
  tChartTableClasses,
  tChartTableHeadClasses,
  tChartTableWrapperClasses,
} from './TChart.variants'
import type { TChartProps } from './types'

// A chart filling its parent. The controller (@repo/chart-core) owns the engine: it is created on mount,
// receives every later prop change as a spec (applied in place: series matched by id) and is destroyed on
// unmount. An invalid spec or an engine error shows a message in the chart's place.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TChartProps>(), {
  // Both take a boolean too: without an explicit undefined default, Vue would turn "unset" into false.
  legend: undefined,
  tooltip: undefined,
  loading: false,
  loadingLabel: 'Loading…',
  table: 'hidden',
})
const emit = defineEmits<{
  'point-click': [event: ChartPointEvent]
  'point-hover': [event: ChartPointEvent | null]
  'series-toggle': [event: ChartToggleEvent]
  load: [chart: ChartInstance]
}>()
const root = useRootAttrs(() => tChartClasses)
const hasListener = useListeners()

// The spec reads every series and data array through the props (so in-place changes are tracked) and hands
// the engine fresh, non-reactive copies: it never sees Vue's proxies.
const spec = computed<ChartSpec>(() => ({
  type: props.type,
  series: props.series.map((series) => ({
    ...toRaw(series),
    data: series.data.map((datum) => toRaw(datum)),
  })),
  categories: props.categories && [...toRaw(props.categories)],
  xAxis: props.xAxis && { ...toRaw(props.xAxis) },
  yAxis: props.yAxis && { ...toRaw(props.yAxis) },
  title: props.title,
  subtitle: props.subtitle,
  caption: props.caption,
  ariaLabel: props.ariaLabel,
  stacking: props.stacking,
  legend: props.legend,
  tooltip: props.tooltip,
  valueFormat: props.valueFormat,
  colors: props.colors && [...toRaw(props.colors)],
  emptyLabel: props.emptyLabel,
  clickable: hasListener('onPointClick'),
  options: props.options && toRaw(props.options),
}))
const invalid = computed(() => validateSpec(spec.value))
const loadingLabel = computed(() => (props.loading ? props.loadingLabel : null))

const handlers: ChartHandlers = {
  onPointClick: (event) => emit('point-click', event),
  onPointHover: (event) => emit('point-hover', event),
  onSeriesToggle: (event) => emit('series-toggle', event),
  onLoad: (chart) => emit('load', chart),
}

const container = ref<HTMLElement | null>(null)
// The controller is never made reactive.
const controller = shallowRef<ChartController | null>(null)
const failure = ref<string | null>(null)

function create() {
  if (invalid.value || !container.value || controller.value) return
  const created = new ChartController(container.value, spec.value, handlers)
  created.setLoading(loadingLabel.value)
  controller.value = created
  failure.value = created.failed?.message ?? null
}

function destroy() {
  const current = controller.value
  controller.value = null
  current?.destroy()
}

onMounted(create)
onUnmounted(destroy)

// One controller while the spec is valid.
watch(invalid, (message) => (message ? destroy() : create()))

watch(spec, (next) => {
  const current = controller.value
  if (!current) return
  current.update(next)
  failure.value = current.failed?.message ?? null
})

watch(loadingLabel, (label) => controller.value?.setLoading(label))

const message = computed(
  () =>
    invalid.value ??
    (failure.value && `The chart could not be drawn: ${failure.value}`),
)
const data = computed(() =>
  props.table !== 'none' && !invalid.value ? chartTable(spec.value) : null,
)
const tableCaption = computed(
  () => props.caption ?? props.title ?? props.ariaLabel,
)

defineExpose({
  /** The engine's chart, or null before it is created (or after an engine error). */
  getChart: (): ChartInstance | null => controller.value?.chart ?? null,
})
</script>

<template>
  <div data-slot="chart" v-bind="root()">
    <div
      ref="container"
      data-slot="chart-canvas"
      :class="tChartCanvasClasses"
    />
    <div
      v-if="message"
      role="status"
      data-slot="chart-message"
      :class="tChartMessageClasses"
    >
      {{ message }}
    </div>
    <div
      v-if="data"
      data-slot="chart-table"
      :class="tChartTableWrapperClasses[table as 'hidden' | 'visible']"
    >
      <table :class="tChartTableClasses">
        <caption v-if="tableCaption" :class="tChartTableCaptionClasses">
          {{
            tableCaption
          }}
        </caption>
        <thead>
          <tr>
            <th
              v-for="(column, index) in data.columns"
              :key="index"
              scope="col"
              :class="tChartTableHeadClasses"
            >
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in data.rows" :key="rowIndex">
            <template v-for="(cell, index) in row" :key="index">
              <th
                v-if="index === 0"
                scope="row"
                :class="tChartTableHeadClasses"
              >
                {{ cell }}
              </th>
              <td v-else :class="tChartTableCellClasses">{{ cell }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
