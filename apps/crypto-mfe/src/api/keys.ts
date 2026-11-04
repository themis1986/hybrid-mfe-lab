import type { ChartRange, CoinListParams } from '../types'

// One factory per domain, hierarchical so an invalidation can be as narrow or as wide as it needs:
// coinKeys.detail(id) also covers that coin's charts. No query key is written anywhere else.
export const coinKeys = {
  all: ['coins'] as const,
  lists: () => [...coinKeys.all, 'list'] as const,
  list: (params: CoinListParams) => [...coinKeys.lists(), params] as const,
  details: () => [...coinKeys.all, 'detail'] as const,
  detail: (id: string) => [...coinKeys.details(), id] as const,
  chart: (id: string, range: ChartRange) =>
    [...coinKeys.detail(id), 'chart', range] as const,
}

export const marketKeys = {
  all: ['market'] as const,
  global: () => [...marketKeys.all, 'global'] as const,
}

export const sentimentKeys = {
  all: ['sentiment'] as const,
  fearGreed: (days: number) =>
    [...sentimentKeys.all, 'fear-greed', days] as const,
}
