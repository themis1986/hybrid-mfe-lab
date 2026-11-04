import { queryOptions, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { fetchFearGreed } from '../api/alternativeMe'
import { sentimentKeys } from '../api/keys'

const ONE_HOUR = 60 * 60 * 1000
const DAYS = 30

export function fearGreedOptions() {
  return queryOptions({
    queryKey: sentimentKeys.fearGreed(DAYS),
    queryFn: ({ signal }) => fetchFearGreed(DAYS, signal),
    // The index changes once a day, so it isn't polled.
    staleTime: ONE_HOUR,
  })
}

/** The Fear & Greed Index: its last 30 days, and today's reading from the same call. */
export function useFearGreed() {
  const query = useQuery(fearGreedOptions())
  return {
    query,
    latest: computed(() => query.data.value?.at(-1)),
  }
}
