// The app's own view of the market. Provider responses are mapped onto these in src/api/, so swapping a
// provider stays local. Values the provider can leave out are null; components render them as a dash.

export type ChartRange = '24h' | '7d' | '30d' | '1y'

export interface CoinListParams {
  perPage: number
  page: number
}

export interface CoinMarket {
  id: string
  name: string
  /** Upper case. */
  symbol: string
  image: string | null
  rank: number | null
  price: number | null
  /** Percent changes in USD. */
  change1h: number | null
  change24h: number | null
  change7d: number | null
  volume24h: number | null
  marketCap: number | null
  /** Hourly prices over the last 7 days, oldest first. */
  sparkline: number[]
}

export interface CoinLink {
  label: string
  url: string
}

export interface CoinDetail {
  id: string
  name: string
  symbol: string
  image: string | null
  rank: number | null
  price: number | null
  change24h: number | null
  marketCap: number | null
  volume24h: number | null
  low24h: number | null
  high24h: number | null
  circulatingSupply: number | null
  maxSupply: number | null
  ath: number | null
  /** Percent from the all-time high to today's price. */
  athChange: number | null
  /** Epoch milliseconds. */
  athDate: number | null
  atl: number | null
  atlChange: number | null
  atlDate: number | null
  /** Plain text, never markup. */
  description: string
  /** http(s) links only. */
  links: CoinLink[]
}

/** [epoch milliseconds, price in USD], oldest first. */
export type PricePoint = [time: number, price: number]

export interface MarketShare {
  /** Upper case, or "Other" for the rest of the market. */
  label: string
  percent: number
}

export interface GlobalMarket {
  totalMarketCap: number | null
  totalVolume: number | null
  marketCapChange24h: number | null
  btcDominance: number | null
  /** The largest coins, biggest first, then "Other". */
  shares: MarketShare[]
}

export interface FearGreedPoint {
  /** Epoch milliseconds. */
  time: number
  /** 0 (extreme fear) to 100 (extreme greed). */
  value: number
  label: string
}
