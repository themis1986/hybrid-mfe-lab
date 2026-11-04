import { queryOptions, useQuery } from '@tanstack/vue-query'
import { type MaybeRefOrGetter, toValue } from 'vue'
import { fetchCoinChart } from '../api/coingecko'
import { coinKeys } from '../api/keys'
import type { ChartRange, PricePoint } from '../types'
import { useCryptoState } from './useCryptoState'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

// A longer range changes more slowly. None of these poll: the page's header carries the live price.
const STALE_TIME: Record<ChartRange, number> = {
  '24h': 5 * MINUTE,
  '7d': 15 * MINUTE,
  '30d': HOUR,
  '1y': 6 * HOUR,
}

/** Where the coin's id sits in the key: ['coins', 'detail', id, 'chart', range]. */
const COIN_ID_POSITION = coinKeys.details().length

/** One coin's prices over the selected range. */
export function useCoinChart(id: MaybeRefOrGetter<string>) {
  const { chartRange } = useCryptoState()

  return useQuery(
    queryOptions(() => {
      const coinId = toValue(id)
      const range = chartRange.value
      return {
        queryKey: coinKeys.chart(coinId, range),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
          fetchCoinChart(coinId, range, signal),
        staleTime: STALE_TIME[range],
        shallow: true,
        // keepPreviousData, but only between ranges: moving to another coin must never show this one's chart.
        placeholderData: (
          previous: PricePoint[] | undefined,
          previousQuery: { queryKey: readonly unknown[] } | undefined,
        ) =>
          previousQuery?.queryKey[COIN_ID_POSITION] === coinId
            ? previous
            : undefined,
      }
    }),
  )
}
