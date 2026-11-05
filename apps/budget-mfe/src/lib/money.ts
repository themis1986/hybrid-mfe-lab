// Amounts are positive numbers in major units (12.5 is 12.50); a transaction's type gives the sign. Sums go
// through whole cents, so adding many amounts never drifts the way floating point does (0.1 + 0.2).

/** The one currency the app shows. Changing it changes every amount's symbol, not the numbers. */
export const CURRENCY = 'EUR'

export function toCents(amount: number): number {
  return Math.round(amount * 100)
}

export function fromCents(cents: number): number {
  return cents / 100
}

/** The exact sum of the amounts. */
export function sumAmounts(amounts: Iterable<number>): number {
  let cents = 0
  for (const amount of amounts) cents += toCents(amount)
  return fromCents(cents)
}

/** Whether the number has at most two decimal places (12.5 and 12.25 do, 12.255 doesn't). */
export function hasAtMostTwoDecimals(amount: number): boolean {
  return Math.abs(amount * 100 - Math.round(amount * 100)) < 1e-6
}

const MONEY = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: CURRENCY,
})
const SIGNED_MONEY = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: CURRENCY,
  signDisplay: 'exceptZero',
})
const COMPACT_MONEY = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: CURRENCY,
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** "€1,234.50", in the browser's locale. */
export function formatMoney(amount: number): string {
  return MONEY.format(amount)
}

/** "+€12.50" or "−€12.50". */
export function formatSignedMoney(amount: number): string {
  return SIGNED_MONEY.format(amount)
}

/** "€1.2K", for axis labels. */
export function formatCompactMoney(amount: number): string {
  return COMPACT_MONEY.format(amount)
}

/** The currency's symbol, e.g. for a field label. */
export const CURRENCY_SYMBOL =
  MONEY.formatToParts(0).find((part) => part.type === 'currency')?.value ??
  CURRENCY

/** An amount as an input shows it: "12.50", with a dot, so the field reads back the same. */
export function toAmountText(amount: number): string {
  return amount.toFixed(2)
}

/**
 * Reads an amount someone typed or a file holds: "12.50", "12,50", "1,234.50", "1.234,50", "+12". Spaces are
 * ignored. Returns NaN for anything else, so the schema reports it; a minus sign stays, so it reports that too.
 */
export function parseAmountText(text: string): number {
  const value = text.replace(/\s/g, '').replace(/^\+/, '')
  if (value === '') return Number.NaN
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  if (/^-?\d+,\d{1,2}$/.test(value)) return Number(value.replace(',', '.'))
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(value)) {
    return Number(value.replaceAll(',', ''))
  }
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(value)) {
    return Number(value.replaceAll('.', '').replace(',', '.'))
  }
  return Number.NaN
}
