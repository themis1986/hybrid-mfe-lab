import {
  type CalendarDateTime,
  Time,
  toCalendarDateTime,
} from '@internationalized/date'
import { useState } from 'react'
import { parseIsoTime, toIsoTime } from '../../lib/date'
import { todayDate } from '../TCalendar/calendarGrid'
import { DateSegments } from '../TDateField/DateSegments'
import { FieldRoot } from '../TDateField/FieldRoot'
import { tDateFieldSegmentsClasses } from '../TDateField/TDateField.variants'
import type { SegmentDate } from '../TDateField/segments'
import type { TTimeFieldProps } from './types'

const onToday = (time: Time) => toCalendarDateTime(todayDate(), time)

// A time of day typed into segments, written to behave like Reka's TimeField (the Vue library's TTimeField),
// with TDateField's keys; A or P sets the AM/PM segment. `value` is an ISO time ('14:30', or '14:30:15' with
// granularity 'second'), undefined until every segment is filled.
export function TTimeField({
  locale = 'en-US',
  granularity = 'minute',
  hourCycle,
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  ...field
}: TTimeFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const time = parseIsoTime(
    valueProp !== undefined ? valueProp : uncontrolledValue,
  )
  const value = time && onToday(time)
  // An empty field works on midnight, as Reka's.
  const [fallback] = useState(() => onToday(new Time(0, 0, 0)))
  const minTime = parseIsoTime(min)
  const maxTime = parseIsoTime(max)

  function commit(next: SegmentDate | undefined) {
    const iso = next
      ? toIsoTime(next as CalendarDateTime, granularity)
      : undefined
    if (valueProp === undefined) setUncontrolledValue(iso)
    onValueChange?.(iso)
  }

  const outOfRange =
    !!time &&
    ((!!minTime && time.compare(minTime) < 0) ||
      (!!maxTime && time.compare(maxTime) > 0))

  return (
    <FieldRoot
      slot="time-field"
      {...field}
      outOfRange={outOfRange}
      submitValue={time ? toIsoTime(time, granularity) : ''}
    >
      <div
        data-slot="date-field-segments"
        className={tDateFieldSegmentsClasses}
      >
        <DateSegments
          kind="time"
          value={value}
          onValueChange={commit}
          fallback={fallback}
          locale={locale}
          granularity={granularity}
          hourCycle={hourCycle}
          disabled={field.disabled}
          readonly={field.readonly}
          invalid={outOfRange}
        />
      </div>
    </FieldRoot>
  )
}
