import type { FearGreedPoint } from '../types'
import { badResponse, getJson } from './http'

const PROVIDER = 'Alternative.me'
const URL_BASE = 'https://api.alternative.me/fng/'

/** The Fear & Greed Index for the last `days` days, oldest first. */
export async function fetchFearGreed(
  days: number,
  signal?: AbortSignal,
): Promise<FearGreedPoint[]> {
  const url = new URL(URL_BASE)
  url.searchParams.set('limit', String(days))
  const body = (await getJson(PROVIDER, url, { signal })) as {
    data?: unknown
  } | null
  if (!Array.isArray(body?.data)) throw badResponse(PROVIDER)
  return (
    body.data
      // The API sends numbers as strings, with timestamps in seconds.
      .map((item) => ({
        time: Number(item?.timestamp) * 1000,
        value: Number(item?.value),
        label: String(item?.value_classification ?? ''),
      }))
      .filter(
        (point) => Number.isFinite(point.time) && Number.isFinite(point.value),
      )
      .sort((a, b) => a.time - b.time)
  )
}
