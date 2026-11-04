// Cell values to text. Intl objects are costly to build and cells render often, so each is built once per
// locale and options; the cache holds no table state.
const numberFormats = new Map<string, Intl.NumberFormat>()
const dateFormats = new Map<string, Intl.DateTimeFormat>()

export function formatTableNumber(
  value: unknown,
  locale?: string,
  options?: Intl.NumberFormatOptions,
): string {
  if (value === null || value === undefined || value === '') return ''
  const number = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(number)) return String(value)
  const key = `${locale ?? ''}|${options ? JSON.stringify(options) : ''}`
  let format = numberFormats.get(key)
  if (!format) {
    format = new Intl.NumberFormat(locale, options)
    numberFormats.set(key, format)
  }
  return format.format(number)
}

/** A date-only ISO string names a calendar day, so it is read as local time rather than UTC. */
export function parseTableDate(value: unknown): Date | undefined {
  if (value instanceof Date) return value
  if (typeof value !== 'string' || !value) return undefined
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnly
    ? new Date(+dateOnly[1]!, +dateOnly[2]! - 1, +dateOnly[3]!)
    : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function formatTableDate(
  value: unknown,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const date = parseTableDate(value)
  if (!date) return value === null || value === undefined ? '' : String(value)
  const key = `${locale ?? ''}|${JSON.stringify(options)}`
  let format = dateFormats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, options)
    dateFormats.set(key, format)
  }
  return format.format(date)
}
