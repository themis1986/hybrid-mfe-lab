import { safeUrl, summarize } from '../lib/text'
import type {
  ChartRange,
  CoinDetail,
  CoinLink,
  CoinListParams,
  CoinMarket,
  GlobalMarket,
  MarketShare,
  PricePoint,
} from '../types'
import { badResponse, getJson, toNumber } from './http'

const PROVIDER = 'CoinGecko'
const BASE_URL = 'https://api.coingecko.com/api/v3/'
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY?.trim()

/** A demo key allows far more calls than the keyless API, so polling can be quicker. */
export const hasApiKey = Boolean(API_KEY)

const DAYS: Record<ChartRange, number> = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '1y': 365,
}

/** How many coins /global's share list contributes before the rest folds into "Other". */
const SHARES_SHOWN = 7

function endpoint(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(path, BASE_URL)
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, String(value))
  }
  return url
}

function get(url: URL, signal?: AbortSignal) {
  return getJson(PROVIDER, url, {
    signal,
    headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : undefined,
  })
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function toDate(value: unknown): number | null {
  const time = Date.parse(toText(value))
  return Number.isNaN(time) ? null : time
}

function toImage(value: unknown): string | null {
  return safeUrl(value) ?? null
}

function toMarket(raw: Record<string, any>): CoinMarket {
  const prices: unknown = raw.sparkline_in_7d?.price
  return {
    id: toText(raw.id),
    name: toText(raw.name),
    symbol: toText(raw.symbol).toUpperCase(),
    image: toImage(raw.image),
    rank: toNumber(raw.market_cap_rank),
    price: toNumber(raw.current_price),
    change1h: toNumber(raw.price_change_percentage_1h_in_currency),
    change24h: toNumber(raw.price_change_percentage_24h_in_currency),
    change7d: toNumber(raw.price_change_percentage_7d_in_currency),
    volume24h: toNumber(raw.total_volume),
    marketCap: toNumber(raw.market_cap),
    sparkline: Array.isArray(prices)
      ? prices.filter((price) => toNumber(price) !== null)
      : [],
  }
}

export async function fetchCoinList(
  { perPage, page }: CoinListParams,
  signal?: AbortSignal,
): Promise<CoinMarket[]> {
  const body = await get(
    endpoint('coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: 'true',
      price_change_percentage: '1h,24h,7d',
    }),
    signal,
  )
  if (!Array.isArray(body)) throw badResponse(PROVIDER)
  return body.filter((coin) => isRecord(coin) && coin.id).map(toMarket)
}

function toLinks(raw: Record<string, any>): CoinLink[] {
  const candidates: [string, unknown][] = [
    ['Website', raw.homepage?.[0]],
    ['Whitepaper', raw.whitepaper],
    ['Explorer', raw.blockchain_site?.[0]],
    ['Source code', raw.repos_url?.github?.[0]],
    ['Reddit', raw.subreddit_url],
  ]
  return candidates.flatMap(([label, value]) => {
    const url = safeUrl(value)
    return url ? [{ label, url }] : []
  })
}

export async function fetchCoinDetail(
  id: string,
  signal?: AbortSignal,
): Promise<CoinDetail> {
  const body = await get(
    endpoint(`coins/${encodeURIComponent(id)}`, {
      localization: 'false',
      tickers: 'false',
      market_data: 'true',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false',
    }),
    signal,
  )
  if (!isRecord(body) || !isRecord(body.market_data)) {
    throw badResponse(PROVIDER)
  }
  const market: Record<string, any> = body.market_data
  return {
    id: toText(body.id) || id,
    name: toText(body.name),
    symbol: toText(body.symbol).toUpperCase(),
    image: toImage(body.image?.small),
    rank: toNumber(body.market_cap_rank),
    price: toNumber(market.current_price?.usd),
    change24h: toNumber(market.price_change_percentage_24h),
    marketCap: toNumber(market.market_cap?.usd),
    volume24h: toNumber(market.total_volume?.usd),
    low24h: toNumber(market.low_24h?.usd),
    high24h: toNumber(market.high_24h?.usd),
    circulatingSupply: toNumber(market.circulating_supply),
    maxSupply: toNumber(market.max_supply),
    ath: toNumber(market.ath?.usd),
    athChange: toNumber(market.ath_change_percentage?.usd),
    athDate: toDate(market.ath_date?.usd),
    atl: toNumber(market.atl?.usd),
    atlChange: toNumber(market.atl_change_percentage?.usd),
    atlDate: toDate(market.atl_date?.usd),
    description: summarize(toText(body.description?.en)),
    links: toLinks(isRecord(body.links) ? body.links : {}),
  }
}

export async function fetchCoinChart(
  id: string,
  range: ChartRange,
  signal?: AbortSignal,
): Promise<PricePoint[]> {
  const body = await get(
    endpoint(`coins/${encodeURIComponent(id)}/market_chart`, {
      vs_currency: 'usd',
      days: DAYS[range],
    }),
    signal,
  )
  if (!isRecord(body) || !Array.isArray(body.prices)) {
    throw badResponse(PROVIDER)
  }
  return body.prices.flatMap((point: unknown) => {
    if (!Array.isArray(point)) return []
    const time = toNumber(point[0])
    const price = toNumber(point[1])
    return time !== null && price !== null ? [[time, price] as PricePoint] : []
  })
}

function toShares(percentages: unknown): MarketShare[] {
  if (!isRecord(percentages)) return []
  const listed = Object.entries(percentages)
    .flatMap(([symbol, value]) => {
      const percent = toNumber(value)
      return percent === null ? [] : [{ label: symbol.toUpperCase(), percent }]
    })
    .sort((a, b) => b.percent - a.percent)
  const shown = listed.slice(0, SHARES_SHOWN)
  const other = 100 - shown.reduce((sum, share) => sum + share.percent, 0)
  return other > 0 ? [...shown, { label: 'Other', percent: other }] : shown
}

export async function fetchGlobalMarket(
  signal?: AbortSignal,
): Promise<GlobalMarket> {
  const body = await get(endpoint('global'), signal)
  if (!isRecord(body) || !isRecord(body.data)) throw badResponse(PROVIDER)
  const data: Record<string, any> = body.data
  // data.fear_and_greed_index is CoinGecko's own index, which differs from the one this app credits and shows.
  return {
    totalMarketCap: toNumber(data.total_market_cap?.usd),
    totalVolume: toNumber(data.total_volume?.usd),
    marketCapChange24h: toNumber(data.market_cap_change_percentage_24h_usd),
    btcDominance: toNumber(data.market_cap_percentage?.btc),
    shares: toShares(data.market_cap_percentage),
  }
}
