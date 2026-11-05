import {
  addDays,
  addMonths,
  daysInRange,
  eachDay,
  eachMonth,
  endOfMonth,
  formatDayMonth,
  formatShortMonth,
  startOfMonth,
  startOfYear,
} from './dates'

/** A date range, both ends included, in ISO dates. The same shape as the library's TDateRange. */
export interface Period {
  start: string
  end: string
}

export function inPeriod(date: string, period: Period): boolean {
  return date >= period.start && date <= period.end
}

/** The period of the same length just before this one, for the deltas. */
export function previousPeriod(period: Period): Period {
  const days = daysInRange(period.start, period.end)
  return { start: addDays(period.start, -days), end: addDays(period.start, -1) }
}

/** What the app opens on: this month and the two before it. */
export function defaultPeriod(now: string): Period {
  return { start: startOfMonth(addMonths(now, -2)), end: now }
}

/** The ranges offered beside the period picker's calendar. */
export function periodPresets(now: string): { label: string; value: Period }[] {
  const lastMonth = addMonths(now, -1)
  return [
    { label: 'This month', value: { start: startOfMonth(now), end: now } },
    {
      label: 'Last month',
      value: { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) },
    },
    { label: 'Last 3 months', value: defaultPeriod(now) },
    {
      label: 'Last 6 months',
      value: { start: startOfMonth(addMonths(now, -5)), end: now },
    },
    { label: 'Year to date', value: { start: startOfYear(now), end: now } },
    {
      label: 'Last 12 months',
      value: { start: startOfMonth(addMonths(now, -11)), end: now },
    },
  ]
}

export interface Bucket {
  key: string
  label: string
  start: string
  end: string
}

/** How a chart over the period groups its points: by day up to about six weeks, by month beyond. */
export function bucketsOf(period: Period): Bucket[] {
  if (daysInRange(period.start, period.end) <= 45) {
    return eachDay(period.start, period.end).map((day) => ({
      key: day,
      label: formatDayMonth(day),
      start: day,
      end: day,
    }))
  }
  return eachMonth(period.start, period.end).map((key) => ({
    key,
    label: formatShortMonth(key),
    start: `${key}-01` < period.start ? period.start : `${key}-01`,
    end: endOfMonth(`${key}-01`) > period.end ? period.end : endOfMonth(`${key}-01`),
  }))
}

/** The bucket a date falls in, by key. */
export function bucketKey(date: string, buckets: readonly Bucket[]): string {
  return buckets[0] && buckets[0].key.length === 7 ? date.slice(0, 7) : date
}
