// The segmented field's logic, written to match Reka's DateField and TimeField (the Vue library's TDateField
// and TTimeField): the same segments in the locale's order, the same placeholders, aria attributes and
// typing rules (digits move on by themselves, Arrow Up/Down cycle, Backspace removes a digit). React-only;
// the Vue fields get all of this from Reka.
import {
  type CalendarDate,
  type CalendarDateTime,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

export type DatePart = 'year' | 'month' | 'day'
export type TimePart = 'hour' | 'minute' | 'second'
export type EditablePart = DatePart | TimePart | 'dayPeriod'
export type DayPeriod = 'AM' | 'PM'

/** Each editable segment's value, null while empty; a time field also has its AM/PM token. */
export type SegmentValues = Partial<
  Record<DatePart | TimePart, number | null>
> & { dayPeriod?: DayPeriod }

/** A segment as rendered: an editable part with its text, or a literal separator. */
export interface Segment {
  part: EditablePart | 'literal'
  text: string
}

/** The date a field works on: a CalendarDate (date field) or a CalendarDateTime on today (time field). */
export type SegmentDate = CalendarDate | CalendarDateTime

export type HourCycle = 12 | 24

export const toJsDate = (date: SegmentDate) => date.toDate(getLocalTimeZone())

const hourCycleOption = (hourCycle?: HourCycle) =>
  hourCycle === 24 ? 'h23' : hourCycle === 12 ? 'h11' : undefined
const hour12Option = (hourCycle?: HourCycle) =>
  hourCycle === 24 ? false : hourCycle === 12 ? true : undefined

/** The empty values of a date field, or of a time field down to `granularity`. */
export function emptyValues(
  kind: 'date' | 'time',
  granularity: TimePart = 'minute',
): SegmentValues {
  if (kind === 'date') return { year: null, month: null, day: null }
  const values: SegmentValues = { hour: null, dayPeriod: 'AM' }
  if (granularity !== 'hour') values.minute = null
  if (granularity === 'second') values.second = null
  return values
}

/** The values of a complete date or time (its AM/PM token from the 24-hour clock). */
export function valuesOf(
  kind: 'date' | 'time',
  date: SegmentDate,
  granularity: TimePart = 'minute',
): SegmentValues {
  if (kind === 'date')
    return { year: date.year, month: date.month, day: date.day }
  const time = date as CalendarDateTime
  const values: SegmentValues = {
    hour: time.hour,
    dayPeriod: time.hour >= 12 ? 'PM' : 'AM',
  }
  if (granularity !== 'hour') values.minute = time.minute
  if (granularity === 'second') values.second = time.second
  return values
}

/** Whether every numeric segment is filled. */
export const isComplete = (values: SegmentValues) =>
  Object.entries(values).every(
    ([part, value]) => part === 'dayPeriod' || value !== null,
  )

/** The date the values name, on the reference date (a time keeps today's date). */
export function dateOf(values: SegmentValues, ref: SegmentDate): SegmentDate {
  const { dayPeriod: _, ...numbers } = values
  return ref.set(numbers as Record<string, number>)
}

// English placeholders, as Reka's for 'en' (Reka has its own for other languages).
const PLACEHOLDERS: Record<EditablePart, string> = {
  year: 'yyyy',
  month: 'mm',
  day: 'dd',
  hour: '––',
  minute: '––',
  second: '––',
  dayPeriod: 'AM',
}

/** The field's segments in the locale's order, each with its text: the value, or the placeholder. */
export function segmentsOf(
  kind: 'date' | 'time',
  values: SegmentValues,
  ref: SegmentDate,
  locale: string,
  granularity: TimePart = 'minute',
  hourCycle?: HourCycle,
): Segment[] {
  const options: Intl.DateTimeFormatOptions =
    kind === 'date'
      ? { year: 'numeric', month: '2-digit', day: '2-digit' }
      : {
          hour: '2-digit',
          ...(granularity !== 'hour' && { minute: '2-digit' }),
          ...(granularity === 'second' && { second: '2-digit' }),
          hourCycle: hourCycleOption(hourCycle),
          hour12: hour12Option(hourCycle),
        }
  const parts = new DateFormatter(locale, options).formatToParts(toJsDate(ref))
  return parts
    .filter((p) =>
      p.type === 'literal'
        ? !['[', ']'].includes(p.value.trim())
        : p.type in values,
    )
    .map((p) =>
      p.type === 'literal'
        ? { part: 'literal' as const, text: p.value }
        : {
            part: p.type as EditablePart,
            text: partText(
              p.type as EditablePart,
              values,
              ref,
              locale,
              hourCycle,
            ),
          },
    )
}

function partText(
  part: EditablePart,
  values: SegmentValues,
  ref: SegmentDate,
  locale: string,
  hourCycle?: HourCycle,
) {
  if (part === 'dayPeriod') return values.dayPeriod ?? PLACEHOLDERS.dayPeriod
  const value = values[part]
  if (value === null || value === undefined) return PLACEHOLDERS[part]
  const date =
    part === 'day'
      ? ref.set({ day: value, month: values.month ?? 1 })
      : ref.set({ [part]: value })
  const formatted = new DateFormatter(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    ...(part in { hour: 1, minute: 1, second: 1 } && {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }),
    hourCycle: hourCycleOption(hourCycle),
  }).formatToParts(toJsDate(date))
  return formatted.find((p) => p.type === part)?.value ?? ''
}

const daysInMonth = (date: SegmentDate) => date.calendar.getDaysInMonth(date)

/** The segment's spinbutton attributes, as Reka's. */
export function segmentAria(
  part: EditablePart,
  values: SegmentValues,
  ref: SegmentDate,
  locale: string,
  hourCycle?: HourCycle,
) {
  if (part === 'dayPeriod') {
    const hour = values.hour ?? 0
    return {
      'aria-label': 'AM/PM',
      'aria-valuemin': 0,
      'aria-valuemax': 12,
      'aria-valuenow': hour > 12 ? hour - 12 : hour,
      'aria-valuetext': values.dayPeriod ?? 'AM',
      inputMode: 'text' as const,
    }
  }
  const value = values[part] ?? null
  const empty = value === null
  let date: SegmentDate = ref
  if (part === 'day')
    date = ref.set({
      ...(values.month && { month: values.month }),
      ...(values.day && { day: values.day }),
    })
  else if (value) date = ref.set({ [part]: value })
  const now = (date as unknown as Record<string, number>)[part]
  const range: Record<Exclude<EditablePart, 'dayPeriod'>, [number, number]> = {
    year: [1, 9999],
    month: [1, 12],
    day: [1, daysInMonth(date)],
    hour: hourCycle === 12 ? [1, 12] : [0, 23],
    minute: [0, 59],
    second: [0, 59],
  }
  const monthName =
    part === 'month' && !empty
      ? ` - ${new DateFormatter(locale, { month: 'long' }).format(toJsDate(date))}`
      : ''
  return {
    'aria-label': part === 'day' ? 'day,' : `${part}, `,
    'aria-valuemin': range[part][0],
    'aria-valuemax': range[part][1],
    'aria-valuenow': now,
    'aria-valuetext': empty
      ? 'Empty'
      : part === 'hour'
        ? `${now} ${values.dayPeriod ?? ''}`
        : `${now}${monthName}`,
    'data-placeholder': empty ? '' : undefined,
    inputMode: 'numeric' as const,
  }
}

/** Typing state carried between keys, as Reka's: whether a 0 was typed first, whether the segment was left. */
export interface TypingState {
  lastKeyZero: boolean
  hasLeftFocus: boolean
}

/** A digit typed into a day, month, hour, minute or second segment: the new value, and whether to move on. */
function typeTwoDigits(
  max: number,
  num: number,
  prev: number | null,
  state: TypingState,
  zeroValue: number | null,
) {
  const maxStart = Math.floor(max / 10)
  if (state.hasLeftFocus) {
    state.hasLeftFocus = false
    state.lastKeyZero = false
    prev = null
  }
  if (prev === null) {
    if (num === 0) {
      state.lastKeyZero = true
      return { value: zeroValue, moveToNext: false }
    }
    const moveToNext = state.lastKeyZero || num > maxStart
    state.lastKeyZero = false
    return { value: num, moveToNext }
  }
  const total = Number.parseInt(`${prev}${num}`)
  if (String(prev).length === 2 || total > max)
    return {
      value: num,
      moveToNext: num > maxStart || (zeroValue === null && total > max),
    }
  return { value: total, moveToNext: true }
}

function typeYear(num: number, prev: number | null, state: TypingState) {
  if (state.hasLeftFocus) {
    state.hasLeftFocus = false
    prev = null
  }
  if (prev === null) return { value: num === 0 ? 1 : num, moveToNext: false }
  const text = `${prev}${num}`
  if (text.length > 4) return { value: num === 0 ? 1 : num, moveToNext: false }
  return { value: Number.parseInt(text), moveToNext: text.length === 4 }
}

/** Whether the hour segment works on a 12-hour clock: `hourCycle`, or the locale's own. */
export function is12Hour(locale: string, hourCycle?: HourCycle) {
  if (hourCycle !== undefined) return hourCycle === 12
  const cycle = new DateFormatter(locale, { hour: 'numeric' }).resolvedOptions()
    .hourCycle
  return cycle === 'h11' || cycle === 'h12'
}

/** A digit typed into a segment: the next values, and whether focus moves to the next segment. */
export function typeDigit(
  part: Exclude<EditablePart, 'dayPeriod'>,
  num: number,
  values: SegmentValues,
  ref: SegmentDate,
  state: TypingState,
  twelveHour: boolean,
): { values: SegmentValues; moveToNext: boolean } {
  const prev = values[part] ?? null
  if (part === 'year') {
    const { value, moveToNext } = typeYear(num, prev, state)
    return { values: { ...values, year: value }, moveToNext }
  }
  if (part === 'day' || part === 'month') {
    const max =
      part === 'month'
        ? 12
        : values.month
          ? daysInMonth(ref.set({ month: values.month }))
          : 31
    const { value, moveToNext } = typeTwoDigits(max, num, prev, state, null)
    return { values: { ...values, [part]: value }, moveToNext }
  }
  if (part === 'hour') {
    const shown =
      twelveHour && prev !== null
        ? prev % 12 === 0
          ? 0
          : prev > 12
            ? prev - 12
            : prev
        : prev
    const { value, moveToNext } = typeTwoDigits(
      twelveHour ? 12 : 24,
      num,
      shown,
      state,
      0,
    )
    let hour = value
    if (twelveHour && value !== null) {
      const period = values.dayPeriod ?? 'AM'
      hour =
        value === 12
          ? period === 'AM'
            ? 0
            : 12
          : period === 'PM'
            ? value + 12
            : value
    }
    return { values: { ...values, hour }, moveToNext }
  }
  const { value, moveToNext } = typeTwoDigits(59, num, prev, state, 0)
  return { values: { ...values, [part]: value }, moveToNext }
}

/** Arrow Up (+1) or Down (-1) on a segment: it cycles within its range; an empty one takes the reference's. */
export function stepSegment(
  part: EditablePart,
  sign: 1 | -1,
  values: SegmentValues,
  ref: SegmentDate,
): SegmentValues {
  if (part === 'dayPeriod') {
    if (values.hour === null || values.hour === undefined)
      return { ...values, dayPeriod: values.dayPeriod === 'AM' ? 'PM' : 'AM' }
    return values.dayPeriod === 'AM'
      ? { ...values, dayPeriod: 'PM', hour: values.hour + 12 }
      : { ...values, dayPeriod: 'AM', hour: values.hour - 12 }
  }
  const prev = values[part] ?? null
  if (part === 'minute' || part === 'second') {
    if (prev === null) return { ...values, [part]: sign > 0 ? 0 : 59 }
    return {
      ...values,
      [part]: (ref as CalendarDateTime).set({ [part]: prev }).cycle(part, sign)[
        part
      ],
    }
  }
  if (prev === null) {
    const next = {
      ...values,
      [part]: (ref as unknown as Record<string, number>)[part],
    }
    if (part === 'hour' && 'dayPeriod' in values)
      next.dayPeriod = next.hour! >= 12 ? 'PM' : 'AM'
    return next
  }
  if (part === 'hour') {
    const hour = (ref as CalendarDateTime)
      .set({ hour: prev })
      .cycle('hour', sign).hour
    return {
      ...values,
      hour,
      ...('dayPeriod' in values && { dayPeriod: hour >= 12 ? 'PM' : 'AM' }),
    }
  }
  const base =
    part === 'day'
      ? ref.set({ day: prev, month: values.month ?? 1 })
      : ref.set({ [part]: prev })
  return { ...values, [part]: base.cycle(part, sign)[part] }
}

/** Backspace on a segment: it drops its last digit, and empties once only one is left. */
export function removeDigit(prev: number | null): number | null {
  if (prev === null) return null
  const text = String(prev)
  return text.length === 1 ? null : Number.parseInt(text.slice(0, -1))
}
