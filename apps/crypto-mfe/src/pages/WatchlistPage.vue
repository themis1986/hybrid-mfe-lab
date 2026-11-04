<script setup lang="ts">
import { computed } from 'vue'
import CoinTable from '../components/CoinTable.vue'
import QueryStatus from '../components/QueryStatus.vue'
import { coinPath } from '../hooks/useCoinRowClick'
import { useCoinList } from '../hooks/useCoinList'
import { useCryptoState } from '../hooks/useCryptoState'

// Filters the market list, so a watchlist costs no extra calls. A coin opened by its URL can be starred without
// being in the list: those show as links.
const query = useCoinList()
const { watchlist } = useCryptoState()

const coins = computed(() =>
  (query.data.value ?? []).filter((coin) => watchlist.value.includes(coin.id)),
)
const elsewhere = computed(() =>
  query.data.value
    ? watchlist.value.filter(
        (id) => !query.data.value?.some((coin) => coin.id === id),
      )
    : [],
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="m-0 text-2xl font-semibold tracking-tight">Watchlist</h1>
    <p
      v-if="!watchlist.length"
      class="m-0 rounded-lg border border-dashed border-line bg-surface p-6 text-center text-sm text-fg-muted"
    >
      Nothing here yet. Star a coin in the
      <RouterLink to="/" class="text-inherit underline">market</RouterLink> to
      keep it here for this visit.
    </p>
    <template v-else>
      <QueryStatus :query="query" what="the coin list">
        <template #loading>
          <CoinTable :coins="[]" loading />
        </template>
        <CoinTable v-if="coins.length" :coins="coins" />
      </QueryStatus>
      <p v-if="elsewhere.length" class="m-0 text-sm text-fg-muted">
        Outside the top 100:
        <template v-for="(id, index) in elsewhere" :key="id">
          <RouterLink :to="coinPath(id)" class="text-inherit underline">{{
            id
          }}</RouterLink
          >{{ index < elsewhere.length - 1 ? ', ' : '' }}
        </template>
      </p>
    </template>
  </div>
</template>
