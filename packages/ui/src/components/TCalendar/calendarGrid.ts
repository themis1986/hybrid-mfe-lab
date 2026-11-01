// The calendar's month grids, written to match Reka's Calendar (the Vue library's TCalendar): the same
// weeks, weekday names, heading and day labels for a given locale. React-only; the Vue calendar gets all of
// this from Reka.
import {
  CalendarDate,
  DateFormatter,
  endOfMonth,
  getDayOfWeek,
  getLocalTimeZone,
  isEqualMonth,
  startOfMonth,
  today,
} from '@internationalized/date'
import { parseIsoDate, toMatcher } from '../../lib/date'

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface CalendarMonth {
  /** The month's first day. */
  value: CalendarDate
  /** Its weeks, each 7 days, with the neighbouring months' days filling the first and last. */
  rows: CalendarDate[][]
}

export const todayDate = () => today(getLocalTimeZone())

/** The locale's first day of the week, 0 = Sunday (Reka's getWeekStartsOn). */
export function localeWeekStart(locale: string): WeekStartsOn {
  const monday = new CalendarDate(2025, 1, 6)
  return ((1 - getDayOfWeek(monday, locale) + 7) % 7) as WeekStartsOn
}

// 0 = Sunday, whatever the locale.
const weekday = (date: CalendarDate) => date.toDate('UTC').getUTCDay()

function createMonth(
  month: CalendarDate,
  weekStartsOn: WeekStartsOn,
  fixedWeeks: boolean,
): CalendarMonth {
  const first = startOfMonth(month)
  const last = endOfMonth(month)
  const lead = (weekday(first) - weekStartsOn + 7) % 7
  const trail = (weekStartsOn + 6 - weekday(last) + 7) % 7
  let count = lead + last.day + trail
  if (fixedWeeks && count < 42) count = 42
  const days = Array.from({ length: count }, (_, i) =>
    first.add({ days: i - lead }),
  )
  const rows: CalendarDate[][] = []
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7))
  return { value: first, rows }
}

/** `numberOfMonths` months starting with `start`'s month. */
export function createMonths(
  start: CalendarDate,
  numberOfMonths: number,
  weekStartsOn: WeekStartsOn,
  fixedWeeks: boolean,
): CalendarMonth[] {
  return Array.from({ length: Math.max(1, numberOfMonths) }, (_, i) =>
    createMonth(
      startOfMonth(start).add({ months: i }),
      weekStartsOn,
      fixedWeeks,
    ),
  )
}

export function isOutsideVisibleView(
  date: CalendarDate,
  months: CalendarMonth[],
) {
  return !months.some((month) => isEqualMonth(date, month.value))
}

/** The weekday names over the grid, in its order ('Sun', 'Mon', … in en-US). */
export function weekdayNames(
  months: CalendarMonth[],
  locale: string,
): string[] {
  const formatter = new DateFormatter(locale, { weekday: 'short' })
  return months[0].rows[0].map((date) =>
    formatter.format(date.toDate(getLocalTimeZone())),
  )
}

/** "November 2026"; with several months, "November - December 2026" or "December 2026 - January 2027". */
export function headingOf(months: CalendarMonth[], locale: string): string {
  const tz = getLocalTimeZone()
  const first = months[0].value.toDate(tz)
  if (months.length === 1)
    return new DateFormatter(locale, { month: 'long', year: 'numeric' }).format(
      first,
    )
  const last = months[months.length - 1].value.toDate(tz)
  const month = new DateFormatter(locale, { month: 'long' })
  const year = new DateFormatter(locale, { year: 'numeric' })
  return year.format(first) === year.format(last)
    ? `${month.format(first)} - ${month.format(last)} ${year.format(last)}`
    : `${month.format(first)} ${year.format(first)} - ${month.format(last)} ${year.format(last)}`
}

/** A day's accessible name: "Sunday, November 1, 2026". */
export function dayLabel(date: CalendarDate, locale: string): string {
  return new DateFormatter(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date.toDate(getLocalTimeZone()))
}

interface DayRuleProps {
  min?: string
  max?: string
  disabled?: boolean
  isDateDisabled?: (date: string) => boolean
  isDateUnavailable?: (date: string) => boolean
}

/** A calendar's limits as date values, and the tests that follow from them (as Reka's isDateDisabled). */
export function dayRules({
  min,
  max,
  disabled,
  isDateDisabled,
  isDateUnavailable,
}: DayRuleProps) {
  const minDate = parseIsoDate(min)
  const maxDate = parseIsoDate(max)
  const disabledMatcher = toMatcher(isDateDisabled)
  const unavailableMatcher = toMatcher(isDateUnavailable)
  const isDisabled = (date: CalendarDate) =>
    !!disabled ||
    !!disabledMatcher?.(date) ||
    (!!minDate && date.compare(minDate) < 0) ||
    (!!maxDate && date.compare(maxDate) > 0)
  return {
    min: minDate,
    max: maxDate,
    isDateDisabled: disabledMatcher,
    isDateUnavailable: unavailableMatcher,
    isDisabled,
    /** Disabled, out of bounds or unavailable: a range can't cross it. */
    isBlocked: (date: CalendarDate) =>
      isDisabled(date) || !!unavailableMatcher?.(date),
  }
}

/** Whether the month before the grid holds no date after `min`. */
export function isPrevDisabled(
  months: CalendarMonth[],
  min: CalendarDate | undefined,
) {
  return (
    !!min &&
    endOfMonth(months[0].value.subtract({ months: 1 })).compare(min) < 0
  )
}

/** Whether the month after the grid holds no date before `max`. */
export function isNextDisabled(
  months: CalendarMonth[],
  max: CalendarDate | undefined,
) {
  return (
    !!max && months[months.length - 1].value.add({ months: 1 }).compare(max) > 0
  )
}
