<script setup lang="ts">
import { TAvatar, TBadge } from '@repo/ui-vue'
import { formatPrice } from '../lib/format'
import type { CoinDetail } from '../types'
import ChangeValue from './ChangeValue.vue'
import WatchToggle from './WatchToggle.vue'

defineProps<{ coin: CoinDetail }>()
</script>

<template>
  <header class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
    <div class="flex min-w-0 flex-wrap items-center gap-3">
      <TAvatar
        aria-hidden="true"
        size="lg"
        :name="coin.name"
        :src="coin.image ?? undefined"
      />
      <h1 class="m-0 text-2xl font-semibold tracking-tight">
        {{ coin.name }}
      </h1>
      <span class="text-sm text-fg-muted">{{ coin.symbol }}</span>
      <TBadge v-if="coin.rank !== null">Rank {{ coin.rank }}</TBadge>
      <WatchToggle :id="coin.id" :name="coin.name" />
    </div>
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="text-3xl font-semibold tracking-tight tabular-nums">
        {{ formatPrice(coin.price) }}
      </span>
      <span class="inline-flex items-center gap-1 text-sm">
        <ChangeValue :value="coin.change24h" />
        <span class="text-fg-muted">in 24h</span>
      </span>
    </div>
  </header>
</template>
