import { queryOptions, useQuery } from '@tanstack/vue-query'
import { fetchCoinList, hasApiKey } from '../api/coingecko'
import { coinKeys } from '../api/keys'
import type { CoinListParams } from '../types'

const ONE_MINUTE = 60 * 1000

/** The whole table comes from this one call, sparklines included. */
const TOP_COINS: CoinListParams = { perPage: 100, page: 1 }

export function coinListOptions(params: CoinListParams) {
  return queryOptions({
    queryKey: coinKeys.list(params),
    queryFn: ({ signal }) => fetchCoinList(params, signal),
    staleTime: ONE_MINUTE,
    // Prices are the one thing here worth polling, within what the keyless API allows.
    refetchInterval: hasApiKey ? ONE_MINUTE : 2 * ONE_MINUTE,
    // Replaced whole on every update, and large: no need for deep reactivity.
    shallow: true,
  })
}

/** The top coins by market cap. */
export function useCoinList() {
  return useQuery(coinListOptions(TOP_COINS))
}
