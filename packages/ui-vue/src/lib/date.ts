// Date and time values, identical in @repo/ui and @repo/ui-vue: change it in both.
// The components take and emit ISO strings ('2026-11-01', '14:30'); @internationalized/date (Reka's date
// type) stays inside the libraries, and these functions convert at their edges.
import {
  type CalendarDate,
  type DateValue,
  endOfMonth,
  getLocalTimeZone,
  parseDate,
  parseTime,
  startOfMonth,
  type Time,
  toCalendarDate,
  today,
} from '@internationalized/date'

/** A date range as two ISO dates ('2026-11-01'), start before or on end. */
export interface TDateRange {
  start: string
  end: string
}

/** Tests an ISO date ('2026-11-01'): true marks it disabled or unavailable. */
export type TDateMatcher = (date: string) => boolean

/** A named range a range calendar or picker offers next to its grid. */
export interface TDatePreset {
  label: string
  value: TDateRange
}

/** The smallest segment a time field shows. */
export type TTimeGranularity = 'hour' | 'minute' | 'second'

/** The date an ISO string ('2026-11-01') names; undefined when it is missing or invalid. */
export function parseIsoDate(
  iso: string | undefined,
): CalendarDate | undefined {
  if (!iso) return undefined
  try {
    return parseDate(iso)
  } catch {
    return undefined
  }
}

/** A date's ISO string ('2026-11-01'), whatever its type: a date-time keeps only its date. */
export function toIsoDate(date: DateValue): string {
  return toCalendarDate(date).toString()
}

/** The time an ISO string ('14:30' or '14:30:15') names; undefined when it is missing or invalid. */
export function parseIsoTime(iso: string | undefined): Time | undefined {
  if (!iso) return undefined
  try {
    return parseTime(iso)
  } catch {
    return undefined
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** A time's ISO string: '14:30', or '14:30:15' when the field shows seconds. */
export function toIsoTime(
  time: Pick<Time, 'hour' | 'minute' | 'second'>,
  granularity: TTimeGranularity = 'minute',
): string {
  const hm = `${pad(time.hour)}:${pad(time.minute)}`
  return granularity === 'second' ? `${hm}:${pad(time.second)}` : hm
}

/** The range two ISO strings name, when both are valid; a reversed range is put in order. */
export function parseIsoRange(
  range: Partial<TDateRange> | undefined,
): { start: CalendarDate; end: CalendarDate } | undefined {
  const start = parseIsoDate(range?.start)
  const end = parseIsoDate(range?.end)
  if (!start || !end) return undefined
  return start.compare(end) <= 0 ? { start, end } : { start: end, end: start }
}

/** Adapts an ISO-string matcher to one over date values (Reka's `Matcher`). */
export function toMatcher(
  matcher: TDateMatcher | undefined,
): ((date: DateValue) => boolean) | undefined {
  return matcher && ((date) => matcher(toIsoDate(date)))
}

/**
 * The value a range submits with its form: an ISO 8601 interval ('2026-11-01/2026-11-07'), or '' while
 * the range is incomplete, so `required` still blocks the submission.
 */
export function rangeSubmitValue(
  range: Partial<TDateRange> | undefined,
): string {
  return range?.start && range.end ? `${range.start}/${range.end}` : ''
}

/** Common ranges ending today, in the given time zone (the user's by default). */
export function defaultRangePresets(
  timeZone: string = getLocalTimeZone(),
): TDatePreset[] {
  const now = today(timeZone)
  const lastMonth = now.subtract({ months: 1 })
  const range = (start: CalendarDate, end: CalendarDate): TDateRange => ({
    start: start.toString(),
    end: end.toString(),
  })

  return [
    { label: 'Today', value: range(now, now) },
    { label: 'Last 7 days', value: range(now.subtract({ days: 6 }), now) },
    { label: 'Last 30 days', value: range(now.subtract({ days: 29 }), now) },
    { label: 'This month', value: range(startOfMonth(now), now) },
    {
      label: 'Last month',
      value: range(startOfMonth(lastMonth), endOfMonth(lastMonth)),
    },
  ]
}
