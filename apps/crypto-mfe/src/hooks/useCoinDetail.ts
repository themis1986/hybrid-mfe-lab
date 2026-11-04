import { queryOptions, useQuery } from '@tanstack/vue-query'
import { type MaybeRefOrGetter, toValue } from 'vue'
import { fetchCoinDetail } from '../api/coingecko'
import { coinKeys } from '../api/keys'

const ONE_MINUTE = 60 * 1000

export function useCoinDetail(id: MaybeRefOrGetter<string>) {
  return useQuery(
    queryOptions(() => {
      const coinId = toValue(id)
      return {
        queryKey: coinKeys.detail(coinId),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
          fetchCoinDetail(coinId, signal),
        staleTime: ONE_MINUTE,
        refetchInterval: 2 * ONE_MINUTE,
      }
    }),
  )
}
