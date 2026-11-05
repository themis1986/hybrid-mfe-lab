// Dates are ISO strings ("2026-11-01"), which sort and compare as plain text, and months are "2026-11".
// Everything here is local time and pure, apart from today().

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function parse(iso: string): Date {
  const [year = 1970, month = 1, day = 1] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function today(): string {
  return toIsoDate(new Date())
}

export function addDays(iso: string, days: number): string {
  const date = parse(iso)
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

/** The same day n months later, clamped to the month's last day (Jan 31 + 1 month is Feb 28). */
export function addMonths(iso: string, months: number): string {
  const date = parse(iso)
  const day = date.getDate()
  date.setDate(1)
  date.setMonth(date.getMonth() + months)
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  date.setDate(Math.min(day, last))
  return toIsoDate(date)
}

export function startOfMonth(iso: string): string {
  return `${iso.slice(0, 7)}-01`
}

export function endOfMonth(iso: string): string {
  return addDays(addMonths(startOfMonth(iso), 1), -1)
}

export function startOfYear(iso: string): string {
  return `${iso.slice(0, 4)}-01-01`
}

/** "2026-11" */
export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

export function addMonthsToKey(key: string, months: number): string {
  return monthKey(addMonths(`${key}-01`, months))
}

/** Days from start to end, both included. */
export function daysInRange(start: string, end: string): number {
  return Math.round((parse(end).getTime() - parse(start).getTime()) / 86_400_000) + 1
}

export function eachDay(start: string, end: string): string[] {
  const days: string[] = []
  for (let day = start; day <= end; day = addDays(day, 1)) days.push(day)
  return days
}

export function eachMonth(start: string, end: string): string[] {
  const months: string[] = []
  for (let key = monthKey(start); key <= monthKey(end); key = addMonthsToKey(key, 1)) {
    months.push(key)
  }
  return months
}

const SHORT_DATE = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const DAY_MONTH = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
const MONTH_YEAR = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
const SHORT_MONTH = new Intl.DateTimeFormat(undefined, { month: 'short' })

/** "5 Nov 2026", in the browser's locale. */
export function formatDate(iso: string): string {
  return SHORT_DATE.format(parse(iso))
}

/** "5 Nov" */
export function formatDayMonth(iso: string): string {
  return DAY_MONTH.format(parse(iso))
}

/** "November 2026" */
export function formatMonth(key: string): string {
  return MONTH_YEAR.format(parse(`${key}-01`))
}

/** "Nov" */
export function formatShortMonth(key: string): string {
  return SHORT_MONTH.format(parse(`${key}-01`))
}
