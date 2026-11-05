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

/**
 * The period the deltas compare with: the same span, just before. A period that starts on the 1st moves back
 * by whole months (1 Sep–5 Nov compares with 1 Jun–5 Aug), so both hold the same paydays and rent; any other
 * moves back by its number of days.
 */
export function previousPeriod(period: Period): Period {
  if (period.start === startOfMonth(period.start)) {
    const months = eachMonth(period.start, period.end).length
    return {
      start: addMonths(period.start, -months),
      end: addMonths(period.end, -months),
    }
  }
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

/** Seven-day buckets from the period's start; the last one may be shorter. */
export function weeksOf(period: Period): Bucket[] {
  const buckets: Bucket[] = []
  for (let start = period.start; start <= period.end; start = addDays(start, 7)) {
    const end = addDays(start, 6) > period.end ? period.end : addDays(start, 6)
    buckets.push({ key: start, label: formatDayMonth(start), start, end })
  }
  return buckets
}

/**
 * Finer buckets, for a trend (the balance, the sparklines): by day up to about six weeks, by week beyond, so
 * it has enough points to read as one (a three-month period would otherwise be three monthly points).
 */
export function fineBucketsOf(period: Period): Bucket[] {
  return daysInRange(period.start, period.end) <= 45
    ? bucketsOf(period)
    : weeksOf(period)
}

/** Finds the bucket a date falls in, by binary search over the (contiguous, ordered) buckets. */
export function bucketFinder(buckets: readonly Bucket[]): (date: string) => number | undefined {
  return (date) => {
    let low = 0
    let high = buckets.length - 1
    while (low <= high) {
      const middle = (low + high) >> 1
      const bucket = buckets[middle]!
      if (date < bucket.start) high = middle - 1
      else if (date > bucket.end) low = middle + 1
      else return middle
    }
    return undefined
  }
}
