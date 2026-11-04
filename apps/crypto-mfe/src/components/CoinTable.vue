<script setup lang="ts">
import { TAvatar } from '@repo/ui-vue'
import {
  type TableState,
  TDataTable,
  type TDataTableColumn,
} from '@repo/ui-vue/table'
import { computed } from 'vue'
import { coinPath, useCoinRowClick } from '../hooks/useCoinRowClick'
import { useCryptoState } from '../hooks/useCryptoState'
import { formatPrice } from '../lib/format'
import type { CoinMarket } from '../types'
import ChangeValue from './ChangeValue.vue'
import Sparkline from './Sparkline.vue'
import WatchToggle from './WatchToggle.vue'

const props = defineProps<{
  coins: CoinMarket[]
  /** First load: skeleton rows. */
  loading?: boolean
  /** The market table: search, paging and a state that survives leaving the page. */
  paged?: boolean
}>()

const compactUsd: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
}

const change = (
  key: 'change1h' | 'change24h' | 'change7d',
  title: string,
): TDataTableColumn<CoinMarket> => ({
  id: key,
  title,
  // Nulls become undefined, which the table sorts last whichever way the column is sorted.
  accessorFn: (coin) => coin[key] ?? undefined,
  type: 'number',
  align: 'end',
  width: 96,
})

// Stable, as the table asks. The name column's value holds the symbol too, so the search finds either.
const columns: TDataTableColumn<CoinMarket>[] = [
  {
    id: 'watch',
    title: 'Watch',
    width: 48,
    minWidth: 48,
    hideable: false,
    resizable: false,
    pinnable: false,
    reorderable: false,
  },
  {
    id: 'rank',
    title: '#',
    accessorFn: (coin) => coin.rank ?? undefined,
    type: 'number',
    align: 'end',
    width: 76,
    minWidth: 64,
  },
  {
    id: 'name',
    title: 'Coin',
    accessorFn: (coin) => `${coin.name} ${coin.symbol}`,
    width: 188,
    minWidth: 120,
  },
  {
    id: 'price',
    title: 'Price',
    accessorFn: (coin) => coin.price ?? undefined,
    type: 'number',
    align: 'end',
    width: 116,
  },
  change('change1h', '1h'),
  change('change24h', '24h'),
  change('change7d', '7d'),
  {
    id: 'volume24h',
    title: '24h volume',
    accessorFn: (coin) => coin.volume24h ?? undefined,
    type: 'number',
    number: compactUsd,
    align: 'end',
    width: 112,
  },
  {
    id: 'marketCap',
    title: 'Market cap',
    accessorFn: (coin) => coin.marketCap ?? undefined,
    type: 'number',
    number: compactUsd,
    align: 'end',
    width: 112,
  },
  {
    id: 'sparkline',
    title: 'Last 7 days',
    width: 120,
    sortable: false,
  },
]

const { tableState } = useCryptoState()

// The market table keeps its state in the store; the watchlist's is short and starts fresh.
const tableProps = computed(() =>
  props.paged
    ? {
        search: true,
        pagination: { pageSizes: [25, 50, 100] },
        state: tableState.value,
        'onUpdate:state': (state: Partial<TableState> | undefined) => {
          tableState.value = state ?? {}
        },
      }
    : {
        pagination: false,
        defaultState: {
          sorting: [{ id: 'rank', desc: false }],
          columnPinning: { start: ['name'], end: [] },
        },
      },
)

const onTableClick = useCoinRowClick((id) =>
  props.coins.some((coin) => coin.id === id),
)
const getRowId = (coin: CoinMarket) => coin.id
</script>

<template>
  <TDataTable
    v-bind="tableProps"
    aria-label="Coins by market cap"
    density="compact"
    locale="en-US"
    class="[&_tbody_tr]:cursor-pointer"
    :data="coins"
    :columns="columns"
    :get-row-id="getRowId"
    :loading="loading"
    @click="onTableClick"
  >
    <template #header-watch>
      <span class="sr-only">Watch</span>
    </template>
    <template #cell-watch="{ row, tabIndex }">
      <WatchToggle
        :id="row.id"
        :name="row.name"
        :tabindex="tabIndex"
        data-t-activate=""
      />
    </template>
    <template #cell-name="{ row, tabIndex }">
      <RouterLink
        :to="coinPath(row.id)"
        :tabindex="tabIndex"
        data-t-activate=""
        class="flex min-w-0 items-center gap-2 text-inherit no-underline hover:underline"
      >
        <TAvatar
          aria-hidden="true"
          size="sm"
          :name="row.name"
          :src="row.image ?? undefined"
          class="shrink-0"
        />
        <span class="min-w-0 flex-1 truncate font-medium">{{ row.name }}</span>
        <span class="max-w-14 shrink-0 truncate text-xs text-fg-muted">{{
          row.symbol
        }}</span>
      </RouterLink>
    </template>
    <template #cell-price="{ row }">
      <span class="tabular-nums">{{ formatPrice(row.price) }}</span>
    </template>
    <template #cell-change1h="{ row }">
      <ChangeValue :value="row.change1h" />
    </template>
    <template #cell-change24h="{ row }">
      <ChangeValue :value="row.change24h" />
    </template>
    <template #cell-change7d="{ row }">
      <ChangeValue :value="row.change7d" />
    </template>
    <template #cell-sparkline="{ row }">
      <Sparkline
        :values="row.sparkline"
        :name="row.name"
        :change="row.change7d"
      />
    </template>
    <template #empty>
      <span class="text-sm text-fg-muted">No coins match.</span>
    </template>
  </TDataTable>
</template>
