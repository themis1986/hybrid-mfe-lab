<script setup lang="ts">
import { TCard, TSkeleton, TTabs, TTabsList, TTabsTrigger } from '@repo/ui-vue'
import { type ChartOptions, TChart } from '@repo/ui-vue/charts'
import { computed } from 'vue'
import { useCoinChart } from '../hooks/useCoinChart'
import { useCryptoState } from '../hooks/useCryptoState'
import { chartTimeZone } from '../lib/chart'
import { formatAxisPrice, formatChange, formatPrice } from '../lib/format'
import type { ChartRange } from '../types'
import QueryStatus from './QueryStatus.vue'

// Split from the page and loaded lazily, so the chart engine downloads only with it.
const props = defineProps<{ id: string; name: string }>()

const RANGES: { value: ChartRange; label: string; long: string }[] = [
  { value: '24h', label: '24h', long: 'the last 24 hours' },
  { value: '7d', label: '7d', long: 'the last 7 days' },
  { value: '30d', label: '30d', long: 'the last 30 days' },
  { value: '1y', label: '1y', long: 'the last year' },
]

const { chartRange, setChartRange } = useCryptoState()
const query = useCoinChart(() => props.id)
const isPlaceholderData = query.isPlaceholderData

function onRangeChange(value: string | undefined) {
  if (value) setChartRange(value as ChartRange)
}

const rangeName = computed(
  () => RANGES.find((range) => range.value === chartRange.value)?.long ?? '',
)

const series = computed(() => [
  {
    id: 'price',
    name: props.name,
    color: 'accent',
    marker: false as const,
    data: query.data.value ?? [],
  },
])

// The figures a reader wants from the line, in words: the chart itself has no data table, as hundreds of hidden
// rows would be no help to a screen reader.
const summary = computed(() => {
  const prices = (query.data.value ?? []).map(([, price]) => price)
  const first = prices[0]
  const last = prices.at(-1)
  if (!first || last === undefined) return ''
  return `Low ${formatPrice(Math.min(...prices))}, high ${formatPrice(Math.max(...prices))}, ${formatChange(((last - first) / first) * 100)} over ${rangeName.value}.`
})

// A soft area with quiet gridlines. A price isn't a quantity from zero, so the axis fits the data (threshold: null).
const options: ChartOptions = {
  time: { timezone: chartTimeZone },
  plotOptions: { area: { fillOpacity: 0.15, lineWidth: 2, threshold: null } },
  xAxis: { tickLength: 0, lineWidth: 0, crosshair: true },
  yAxis: {
    gridLineDashStyle: 'Dot',
    title: { text: undefined },
    labels: {
      formatter() {
        return formatAxisPrice(Number(this.value))
      },
    },
  },
}
</script>

<template>
  <TCard variant="filled" :padding="4" as="section" class="min-w-0">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="m-0 text-base font-semibold tracking-tight">Price</h2>
      <TTabs :model-value="chartRange" @update:model-value="onRangeChange">
        <TTabsList variant="pills" aria-label="Chart range">
          <TTabsTrigger
            v-for="range in RANGES"
            :key="range.value"
            :value="range.value"
          >
            {{ range.label }}
          </TTabsTrigger>
        </TTabsList>
      </TTabs>
    </div>
    <div class="mt-3 h-80" :class="isPlaceholderData && 'opacity-60'">
      <QueryStatus :query="query" what="the price history">
        <template #loading>
          <TSkeleton shape="block" class="size-full" />
        </template>
        <TChart
          type="area"
          table="none"
          :aria-label="`${name} price over ${rangeName}. ${summary}`"
          :x-axis="{ type: 'datetime' }"
          :series="series"
          :value-format="formatPrice"
          :legend="false"
          :options="options"
        />
      </QueryStatus>
    </div>
    <p class="m-0 mt-2 min-h-4 text-xs text-fg-muted tabular-nums">
      {{ summary }}
    </p>
  </TCard>
</template>
