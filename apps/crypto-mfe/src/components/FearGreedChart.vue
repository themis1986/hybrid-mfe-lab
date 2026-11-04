<script setup lang="ts">
import { TCard, TSkeleton } from '@repo/ui-vue'
import { type ChartOptions, TLineChart } from '@repo/ui-vue/charts'
import { computed } from 'vue'
import { useFearGreed } from '../hooks/useFearGreed'
import { chartTimeZone } from '../lib/chart'
import QueryStatus from './QueryStatus.vue'

// Split from the page and loaded lazily, so the chart engine downloads only with it.
const { query } = useFearGreed()

const series = computed(() => [
  {
    id: 'fear-greed',
    name: 'Fear & Greed Index',
    color: 'accent',
    marker: false as const,
    data: (query.data.value ?? []).map((point): [number, number] => [
      point.time,
      point.value,
    ]),
  },
])

// The index's own scale, with its bands' edges as the only gridlines.
const options: ChartOptions = {
  time: { timezone: chartTimeZone },
  xAxis: { tickLength: 0, lineWidth: 0 },
  yAxis: { tickPositions: [0, 25, 50, 75, 100], gridLineDashStyle: 'Dot' },
}
</script>

<template>
  <TCard variant="filled" :padding="4" as="section" class="min-w-0">
    <h2 class="m-0 text-base font-semibold tracking-tight">
      Fear &amp; Greed, last 30 days
    </h2>
    <div class="mt-3 h-64">
      <QueryStatus :query="query" what="the Fear & Greed history">
        <template #loading>
          <TSkeleton shape="block" class="size-full" />
        </template>
        <TLineChart
          aria-label="Fear & Greed Index over the last 30 days, from 0 for extreme fear to 100 for extreme greed"
          :series="series"
          :x-axis="{ type: 'datetime' }"
          :y-axis="{ min: 0, max: 100 }"
          :legend="false"
          :options="options"
        />
      </QueryStatus>
    </div>
    <p class="m-0 mt-2 text-xs text-fg-muted">
      0 is extreme fear, 100 is extreme greed. Source:
      <a
        href="https://alternative.me/crypto/fear-and-greed-index/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-inherit underline"
        >Alternative.me</a
      >
    </p>
  </TCard>
</template>
