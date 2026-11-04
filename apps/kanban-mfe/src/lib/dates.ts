// Due dates are ISO strings ("2026-11-01"), which sort and compare as plain text.

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

export function isOverdue(iso: string, now: string): boolean {
  return iso < now
}

const SHORT_DATE = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

/** "Today", "Tomorrow", "Yesterday" or a short date. */
export function formatDueDate(iso: string, now: string): string {
  if (iso === now) return 'Today'
  if (iso === addDays(now, 1)) return 'Tomorrow'
  if (iso === addDays(now, -1)) return 'Yesterday'
  return SHORT_DATE.format(parse(iso))
}
