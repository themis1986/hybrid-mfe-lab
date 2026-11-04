import type { TableState } from '@repo/ui-vue/table'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChartRange } from '../types'

// Client state only: what the APIs return lives in TanStack Query's cache. As with Pinia's other state refs,
// these stay writable here; components go through useCryptoState(), which hands them a readonly view.
export const useCryptoStore = defineStore('crypto', () => {
  const watchlist = ref<string[]>([])
  const chartRange = ref<ChartRange>('7d')
  const tableState = ref<Partial<TableState>>({
    sorting: [{ id: 'rank', desc: false }],
    globalFilter: '',
    pagination: { pageIndex: 0, pageSize: 25 },
    columnPinning: { start: ['name'], end: [] },
  })

  function toggleWatched(id: string) {
    watchlist.value = watchlist.value.includes(id)
      ? watchlist.value.filter((other) => other !== id)
      : [...watchlist.value, id]
  }

  function setChartRange(range: ChartRange) {
    chartRange.value = range
  }

  function setTableState(state: Partial<TableState> | undefined) {
    if (state) tableState.value = state
  }

  return {
    watchlist,
    chartRange,
    tableState,
    toggleWatched,
    setChartRange,
    setTableState,
  }
})
