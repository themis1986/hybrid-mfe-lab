import { queryOptions, useQuery } from '@tanstack/vue-query'
import { fetchGlobalMarket } from '../api/coingecko'
import { marketKeys } from '../api/keys'

const FIVE_MINUTES = 5 * 60 * 1000

export function globalMarketOptions() {
  return queryOptions({
    queryKey: marketKeys.global(),
    queryFn: ({ signal }) => fetchGlobalMarket(signal),
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  })
}

/** Totals for the whole market. */
export function useGlobalMarket() {
  return useQuery(globalMarketOptions())
}
