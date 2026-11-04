const usdLarge = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const usdWhole = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const usdSmall = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 4,
})
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})
const countCompact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
})
const signedPercent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  signDisplay: 'exceptZero',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const plainPercent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const longDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
const clockTime = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' })

const NONE = '—'

type Maybe = number | null | undefined

function present(value: Maybe): value is number {
  return value !== null && value !== undefined && Number.isFinite(value)
}

/** Cents above a dollar; small coins keep enough digits to mean something. */
export function formatPrice(value: Maybe): string {
  if (!present(value)) return NONE
  return (Math.abs(value) >= 1 ? usdLarge : usdSmall).format(value)
}

/** For an axis: its ticks are round, so large prices drop the cents. */
export function formatAxisPrice(value: Maybe): string {
  if (!present(value)) return NONE
  return Math.abs(value) >= 1000 ? usdWhole.format(value) : formatPrice(value)
}

export function formatCompactUsd(value: Maybe): string {
  return present(value) ? usdCompact.format(value) : NONE
}

export function formatSupply(value: Maybe, symbol: string): string {
  return present(value) ? `${countCompact.format(value)} ${symbol}` : NONE
}

/** From a value already in percent: 3.2 gives "+3.20%". */
export function formatChange(value: Maybe): string {
  return present(value) ? signedPercent.format(value / 100) : NONE
}

/** From a value already in percent, for shares of a whole: 59.5 gives "59.5%". */
export function formatShare(value: Maybe): string {
  return present(value) ? plainPercent.format(value / 100) : NONE
}

export function formatDate(time: Maybe): string {
  return present(time) ? longDate.format(time) : NONE
}

export function formatClock(time: Maybe): string {
  return present(time) ? clockTime.format(time) : NONE
}

export type Trend = 'up' | 'down' | 'flat' | 'none'

export function trendOf(value: Maybe): Trend {
  if (!present(value)) return 'none'
  // What rounds to 0.00% in the text mustn't show an arrow beside it.
  if (Math.abs(value) < 0.005) return 'flat'
  return value > 0 ? 'up' : 'down'
}
