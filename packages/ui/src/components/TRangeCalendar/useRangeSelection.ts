import { type CalendarDate, isSameDay } from '@internationalized/date'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { parseIsoRange, type TDateRange, toIsoDate } from '../../lib/date'

interface RangeSelectionOptions {
  /** The committed range (complete), or undefined. */
  value: TDateRange | undefined
  /** Called with each completed range, and with undefined when the range is cleared. */
  onCommit: (range: TDateRange | undefined) => void
  /** Days that can't be picked (disabled, out of bounds or unavailable): a range can't cross them. */
  isBlocked: (date: CalendarDate) => boolean
  /** Days that are disabled (out of bounds included). */
  isDisabled: (date: CalendarDate) => boolean
}

const between = (date: CalendarDate, start: CalendarDate, end: CalendarDate) =>
  date.compare(start) > 0 && date.compare(end) < 0

// The range picking of Reka's RangeCalendar (the Vue library's TRangeCalendar): the first pick sets the start,
// the days between it and the hovered or focused day are highlighted (when none of them is blocked), the
// second pick sets the end, in either order. A pick on the lone start clears it; a pick once both ends are
// set starts over. Escape while picking returns to the committed range. Only complete ranges are committed.
export function useRangeSelection({
  value,
  onCommit,
  isBlocked,
  isDisabled,
}: RangeSelectionOptions) {
  const committed = parseIsoRange(value)
  const [start, setStart] = useState(committed?.start)
  const [end, setEnd] = useState(committed?.end)
  const [active, setActive] = useState<CalendarDate>()
  const last = useRef(committed)

  // A range from outside replaces the one being picked.
  const valueKey = value ? `${value.start}/${value.end}` : ''
  useEffect(() => {
    const next = parseIsoRange(value)
    last.current = next
    setStart(next?.start)
    setEnd(next?.end)
    // valueKey stands for value, compared by value.
  }, [valueKey])

  // The range from a to b, in order, unless a blocked day lies in it.
  function openRange(a: CalendarDate, b: CalendarDate) {
    const [from, to] = a.compare(b) <= 0 ? [a, b] : [b, a]
    for (let day = from; day.compare(to) <= 0; day = day.add({ days: 1 }))
      if (isBlocked(day)) return undefined
    return { start: from, end: to }
  }
  const highlight =
    start && !end && active ? openRange(start, active) : undefined

  function complete(a: CalendarDate, b: CalendarDate) {
    const [from, to] = a.compare(b) <= 0 ? [a, b] : [b, a]
    setStart(from)
    setEnd(to)
    last.current = { start: from, end: to }
    onCommit({ start: toIsoDate(from), end: toIsoDate(to) })
  }

  function select(date: CalendarDate) {
    if (start && !end) {
      // A range across a blocked day can't be completed: the pick starts a new one.
      if (isSameDay(date, start)) setStart(undefined)
      else if (openRange(start, date)) complete(start, date)
      else setStart(date)
      return
    }
    if (start && end && isSameDay(start, end) && isSameDay(start, date)) {
      setStart(undefined)
      setEnd(undefined)
      last.current = undefined
      onCommit(undefined)
      return
    }
    setStart(date)
    setEnd(undefined)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !start || end) return
    setStart(last.current?.start)
    setEnd(last.current?.end)
  }

  const isSelected = (date: CalendarDate) =>
    (!!start && isSameDay(date, start)) ||
    (!!end && isSameDay(date, end)) ||
    (!!start && !!end && between(date, start, end))

  const dayAttributes = (date: CalendarDate, unavailable: boolean) => {
    const inHighlight =
      !!highlight &&
      date.compare(highlight.start) >= 0 &&
      date.compare(highlight.end) <= 0
    return {
      'data-selected': (isSelected(date) && !unavailable) || undefined,
      'data-selection-start': (!!start && isSameDay(date, start)) || undefined,
      'data-selection-end': (!!end && isSameDay(date, end)) || undefined,
      'data-highlighted': (inHighlight && !unavailable) || undefined,
      'data-highlighted-start':
        (!!highlight && isSameDay(date, highlight.start)) || undefined,
      'data-highlighted-end':
        (!!highlight && isSameDay(date, highlight.end)) || undefined,
    } as Record<string, true | undefined>
  }

  const startDisabled = !!start && isDisabled(start)
  const endDisabled = !!end && isDisabled(end)

  return {
    start,
    end,
    select,
    onKeyDown,
    onDayActive: setActive,
    isSelected,
    dayAttributes,
    hasSelectedDate: !!(start || end),
    isSelectedDisabled:
      start && end
        ? startDisabled && endDisabled
        : startDisabled || endDisabled,
    selectedFocusable:
      start && !startDisabled ? start : end && !endDisabled ? end : undefined,
    invalid: startDisabled || endDisabled,
  }
}
