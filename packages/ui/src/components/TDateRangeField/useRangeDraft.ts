import { type CalendarDate } from '@internationalized/date'
import { useEffect, useState } from 'react'
import { parseIsoDate, type TDateRange, toIsoDate } from '../../lib/date'

type Draft = { start?: CalendarDate; end?: CalendarDate }

const draftOf = (range: TDateRange | undefined): Draft => ({
  start: parseIsoDate(range?.start),
  end: parseIsoDate(range?.end),
})

// The two dates a range field is editing, as Reka's DateRangeField keeps them: each end is set once its
// segments are complete; the range is committed when both are set, and cleared when both are empty. A range
// from outside replaces the draft. `out` tells whether an end is unavailable or out of bounds, or the end
// comes before the start (Reka's data-invalid).
export function useRangeDraft(
  value: TDateRange | undefined,
  onCommit: (range: TDateRange | undefined) => void,
  isBlocked: (date: CalendarDate) => boolean,
) {
  const [draft, setDraft] = useState(() => draftOf(value))
  const valueKey = value ? `${value.start}/${value.end}` : ''
  useEffect(() => {
    setDraft(draftOf(value))
    // valueKey stands for value, compared by value.
  }, [valueKey])

  function update(which: 'start' | 'end', date: CalendarDate | undefined) {
    const next = { ...draft, [which]: date }
    setDraft(next)
    if (next.start && next.end)
      onCommit({ start: toIsoDate(next.start), end: toIsoDate(next.end) })
    else if (!next.start && !next.end) onCommit(undefined)
  }

  const { start, end } = draft
  const out =
    (!!start && isBlocked(start)) ||
    (!!end && isBlocked(end)) ||
    (!!start && !!end && end.compare(start) < 0)
  const complete: TDateRange | undefined =
    start && end ? { start: toIsoDate(start), end: toIsoDate(end) } : undefined

  return { start, end, update, out, complete }
}
