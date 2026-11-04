import { ApiError } from '../api/http'

const RETRIES = 2
/** A failure may be a rate limit, and every retry counts against that limit, so these wait a long time. */
const LIMITED_DELAYS_MS = [20_000, 60_000]
const MAX_DELAY_MS = 120_000

function maybeRateLimited(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    (error.kind === 'rate-limit' || error.kind === 'unreachable')
  )
}

/** A missing coin, a refused request or a malformed response won't change by asking again. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= RETRIES) return false
  return (
    maybeRateLimited(error) ||
    (error instanceof ApiError && error.kind === 'server')
  )
}

export function retryDelay(failureCount: number, error: unknown): number {
  if (!maybeRateLimited(error)) return 2000 * 2 ** failureCount
  const planned = LIMITED_DELAYS_MS[failureCount] ?? MAX_DELAY_MS
  return Math.min(Math.max(error.retryAfterMs ?? 0, planned), MAX_DELAY_MS)
}
