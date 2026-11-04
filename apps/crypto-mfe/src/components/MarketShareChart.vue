<script setup lang="ts">
import { TCard, TSkeleton } from '@repo/ui-vue'
import { type ChartOptions, TBarChart } from '@repo/ui-vue/charts'
import { computed } from 'vue'
import { useGlobalMarket } from '../hooks/useGlobalMarket'
import { formatShare } from '../lib/format'
import QueryStatus from './QueryStatus.vue'

// Split from the page and loaded lazily, so the chart engine downloads only with it. Ranked bars rather than a
// donut: past the first two coins the shares are close, and bars on one baseline keep them comparable.
const query = useGlobalMarket()
const shares = computed(() => query.data.value?.shares ?? [])
const categories = computed(() => shares.value.map((share) => share.label))
const series = computed(() => [
  {
    id: 'share',
    name: 'Share of market cap',
    color: 'accent',
    data: shares.value.map((share) => share.percent),
  },
])

// Each bar carries its own figure, so the value axis has nothing to add.
const options: ChartOptions = {
  plotOptions: {
    bar: {
      borderRadius: 4,
      pointPadding: 0.1,
      groupPadding: 0,
      dataLabels: {
        enabled: true,
        format: '{y:.1f}%',
        // A token, so the label follows the theme: the engine's default contrast colour doesn't.
        style: {
          color: 'var(--t-color-fg)',
          textOutline: 'none',
          fontWeight: 'normal',
        },
      },
    },
  },
  xAxis: { tickLength: 0, lineWidth: 0 },
  yAxis: { visible: false, min: 0 },
}
</script>

<template>
  <TCard variant="filled" :padding="4" as="section" class="min-w-0">
    <h2 class="m-0 text-base font-semibold tracking-tight">Market-cap share</h2>
    <div class="mt-3 h-72">
      <QueryStatus :query="query" what="the market shares">
        <template #loading>
          <TSkeleton shape="block" class="size-full" />
        </template>
        <TBarChart
          aria-label="Share of the total market cap, by coin"
          :categories="categories"
          :series="series"
          :value-format="formatShare"
          :legend="false"
          :options="options"
        />
      </QueryStatus>
    </div>
  </TCard>
</template>
