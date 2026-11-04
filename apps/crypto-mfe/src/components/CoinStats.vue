<script setup lang="ts">
import {
  ArrowDownToLine,
  ArrowUpToLine,
  CircleDollarSign,
  Coins,
  MoveVertical,
  Repeat,
} from '@repo/ui-vue/icons'
import { computed } from 'vue'
import {
  formatChange,
  formatCompactUsd,
  formatDate,
  formatPrice,
  formatSupply,
} from '../lib/format'
import type { CoinDetail } from '../types'
import StatCard from './StatCard.vue'

const props = defineProps<{ coin: CoinDetail }>()

const supplyHint = computed(() =>
  props.coin.maxSupply === null
    ? 'No fixed maximum'
    : `Of ${formatSupply(props.coin.maxSupply, props.coin.symbol)} maximum`,
)
</script>

<template>
  <section
    aria-label="Market statistics"
    class="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 @3xl:grid-cols-[repeat(3,minmax(0,1fr))]"
  >
    <StatCard
      label="Market cap"
      :icon="CircleDollarSign"
      :value="formatCompactUsd(coin.marketCap)"
    />
    <StatCard
      label="24h volume"
      :icon="Repeat"
      :value="formatCompactUsd(coin.volume24h)"
    />
    <StatCard
      label="24h range"
      :icon="MoveVertical"
      :value="formatPrice(coin.high24h)"
      :hint="`Low ${formatPrice(coin.low24h)}`"
    />
    <StatCard
      label="Circulating supply"
      :icon="Coins"
      :value="formatSupply(coin.circulatingSupply, coin.symbol)"
      :hint="supplyHint"
    />
    <StatCard
      label="All-time high"
      :icon="ArrowUpToLine"
      :value="formatPrice(coin.ath)"
      :hint="`${formatDate(coin.athDate)}, now ${formatChange(coin.athChange)}`"
    />
    <StatCard
      label="All-time low"
      :icon="ArrowDownToLine"
      :value="formatPrice(coin.atl)"
      :hint="`${formatDate(coin.atlDate)}, now ${formatChange(coin.atlChange)}`"
    />
  </section>
</template>
