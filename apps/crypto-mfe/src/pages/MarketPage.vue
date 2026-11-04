<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import ChartFallback from '../components/ChartFallback.vue'
import CoinTable from '../components/CoinTable.vue'
import MarketSummary from '../components/MarketSummary.vue'
import QueryStatus from '../components/QueryStatus.vue'
import { useCoinList } from '../hooks/useCoinList'
import { formatClock } from '../lib/format'

// The chart engine is heavy: it downloads only with its components.
const MarketShareChart = defineAsyncComponent({
  loader: () => import('../components/MarketShareChart.vue'),
  loadingComponent: ChartFallback,
})
const FearGreedChart = defineAsyncComponent({
  loader: () => import('../components/FearGreedChart.vue'),
  loadingComponent: ChartFallback,
})

const query = useCoinList()
const coins = computed(() => query.data.value ?? [])
const updatedAt = query.dataUpdatedAt
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="m-0 text-2xl font-semibold tracking-tight">Crypto market</h1>

    <MarketSummary />

    <div
      class="grid grid-cols-[minmax(0,1fr)] gap-4 @4xl:grid-cols-[repeat(2,minmax(0,1fr))]"
    >
      <MarketShareChart />
      <FearGreedChart />
    </div>

    <section aria-labelledby="crypto-mfe-top-coins" class="flex flex-col gap-2">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2
          id="crypto-mfe-top-coins"
          class="m-0 text-base font-semibold tracking-tight"
        >
          Top 100 by market cap
        </h2>
        <span v-if="updatedAt" class="text-xs text-fg-muted tabular-nums">
          Updated {{ formatClock(updatedAt) }}
        </span>
      </div>
      <QueryStatus :query="query" what="the coin list">
        <template #loading>
          <CoinTable :coins="[]" loading paged />
        </template>
        <CoinTable :coins="coins" paged />
      </QueryStatus>
    </section>
  </div>
</template>
