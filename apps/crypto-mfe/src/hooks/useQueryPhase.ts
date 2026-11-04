import type { UseQueryReturnType } from '@tanstack/vue-query'
import { computed } from 'vue'
import { ApiError } from '../api/http'

export type QueryLike = Pick<
  UseQueryReturnType<any, Error>,
  | 'data'
  | 'dataUpdatedAt'
  | 'error'
  | 'failureCount'
  | 'failureReason'
  | 'isPaused'
  | 'refetch'
>

export type QueryPhase =
  /** First load, nothing to show yet. */
  | 'loading'
  /** First load, a request failed, and a retry is waiting: this can take over a minute. */
  | 'retrying'
  /** No connection: the query is paused and resumes by itself. */
  | 'offline'
  /** First load failed for good. */
  | 'error'
  /** Data is showing, but the latest update failed or is still being retried. */
  | 'stale'
  | 'ready'

/** What a query's state means for the viewer, the same way everywhere. */
export function useQueryPhase(query: QueryLike) {
  const phase = computed<QueryPhase>(() => {
    const hasData = query.data.value !== undefined
    const failing = query.failureCount.value > 0 || query.error.value !== null
    if (hasData) return failing || query.isPaused.value ? 'stale' : 'ready'
    if (query.isPaused.value) return 'offline'
    if (query.error.value) return 'error'
    return failing ? 'retrying' : 'loading'
  })

  const provider = computed(() => {
    const reason = query.failureReason.value ?? query.error.value
    return reason instanceof ApiError ? reason.provider : 'The data service'
  })

  const notFound = computed(
    () =>
      query.error.value instanceof ApiError &&
      query.error.value.kind === 'not-found',
  )

  /** Why the first load failed, for an error panel. */
  const description = computed(() => {
    const error = query.error.value
    const name = provider.value
    if (!(error instanceof ApiError)) return `${name} didn’t answer.`
    switch (error.kind) {
      case 'rate-limit':
      case 'unreachable':
        return `${name} didn’t answer. It may be limiting requests from this network, or you may be offline.`
      case 'rejected':
        return `${name} refused the request. If you set an API key, check that it is valid.`
      case 'bad-response':
        return `${name} sent something this app can’t read.`
      default:
        return error.message
    }
  })

  return { phase, provider, notFound, description }
}
