<script setup lang="ts">
import { TBadge, TProgress } from '@repo/ui-vue'
import { ChartPie, CircleDollarSign, Gauge, Repeat } from '@repo/ui-vue/icons'
import { computed } from 'vue'
import { useFearGreed } from '../hooks/useFearGreed'
import { useGlobalMarket } from '../hooks/useGlobalMarket'
import { useQueryPhase } from '../hooks/useQueryPhase'
import { formatCompactUsd, formatShare } from '../lib/format'
import ChangeValue from './ChangeValue.vue'
import QueryStatus from './QueryStatus.vue'
import StatCard from './StatCard.vue'

// Each card follows its own query: a failure of one source costs only its own cards.
const globalQuery = useGlobalMarket()
const { query: fearGreedQuery, latest } = useFearGreed()

const global = computed(() => globalQuery.data.value)
const { phase: globalPhase } = useQueryPhase(globalQuery)
const { phase: fearGreedPhase } = useQueryPhase(fearGreedQuery)

const waiting = (phase: string) =>
  phase === 'loading' || phase === 'retrying' || phase === 'offline'

const sentimentTone = computed(() => {
  const value = latest.value?.value ?? 50
  if (value < 25) return 'danger'
  if (value < 45) return 'warning'
  return value > 55 ? 'success' : 'neutral'
})
</script>

<template>
  <section aria-label="Market summary" class="flex flex-col gap-2">
    <QueryStatus :query="globalQuery" what="the market totals" inline />
    <QueryStatus :query="fearGreedQuery" what="the Fear & Greed Index" inline />
    <div
      class="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 @3xl:grid-cols-[repeat(4,minmax(0,1fr))]"
    >
      <StatCard
        label="Market cap"
        :icon="CircleDollarSign"
        :loading="waiting(globalPhase)"
        :value="formatCompactUsd(global?.totalMarketCap)"
      >
        <template #hint>
          <span class="inline-flex items-center gap-1">
            <ChangeValue :value="global?.marketCapChange24h" /> in 24h
          </span>
        </template>
      </StatCard>
      <StatCard
        label="24h volume"
        :icon="Repeat"
        :loading="waiting(globalPhase)"
        :value="formatCompactUsd(global?.totalVolume)"
        hint="Traded across all coins"
      />
      <StatCard
        label="BTC dominance"
        :icon="ChartPie"
        :loading="waiting(globalPhase)"
        :value="formatShare(global?.btcDominance)"
        hint="Bitcoin’s share of the market cap"
      />
      <StatCard
        label="Fear & Greed"
        :icon="Gauge"
        :loading="waiting(fearGreedPhase)"
      >
        <span class="flex flex-wrap items-center gap-2">
          {{ latest?.value ?? '—' }}
          <TBadge v-if="latest" :tone="sentimentTone">{{
            latest.label
          }}</TBadge>
        </span>
        <template #hint>
          <!-- Alternative.me's terms require the credit right next to the data. -->
          Source:
          <a
            href="https://alternative.me/crypto/fear-and-greed-index/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-inherit underline"
            >Alternative.me</a
          >
        </template>
        <template #extra>
          <TProgress
            v-if="latest"
            class="mt-2"
            size="sm"
            :value="latest.value"
            :max="100"
            aria-label="Fear & Greed Index, from 0 for extreme fear to 100 for extreme greed"
            :get-value-label="
              (value) => `${value} out of 100: ${latest?.label}`
            "
          />
        </template>
      </StatCard>
    </div>
  </section>
</template>
