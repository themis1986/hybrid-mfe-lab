import { storeToRefs } from 'pinia'
import { computed, readonly } from 'vue'
import { useCryptoStore } from '../stores/crypto'

/** The app's client state for components: a readonly view of the store plus its actions. */
export function useCryptoState() {
  const store = useCryptoStore()
  const { watchlist, chartRange } = storeToRefs(store)

  return {
    watchlist: readonly(watchlist),
    chartRange: readonly(chartRange),
    isWatched: (id: string) => watchlist.value.includes(id),
    toggleWatched: store.toggleWatched,
    setChartRange: store.setChartRange,
    // For the table's v-model:state: it writes through the action, and reads a type the table accepts.
    tableState: computed({
      get: () => store.tableState,
      set: store.setTableState,
    }),
  }
}
