import { useState } from 'react'
import { parseIsoDate, toIsoDate } from '../../lib/date'
import { dayRules, todayDate } from '../TCalendar/calendarGrid'
import { DateSegments } from './DateSegments'
import { FieldRoot } from './FieldRoot'
import type { SegmentDate } from './segments'
import { tDateFieldSegmentsClasses } from './TDateField.variants'
import type { TDateFieldProps } from './types'

// A date typed into segments, in the locale's order. Radix has no date field, so the segments are editable
// spans written to behave like Reka's DateField (the Vue library's TDateField): type digits (it moves on by
// itself), step a segment with Arrow Up/Down, move between them with Arrow Left/Right, clear one with
// Backspace. `value` is an ISO date ('2026-11-01'), undefined until every segment is filled. Name it with
// aria-label, aria-labelledby, or a <label htmlFor> pointing at `id`.
export function TDateField({
  locale = 'en-US',
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  isDateUnavailable,
  ...field
}: TDateFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = parseIsoDate(
    valueProp !== undefined ? valueProp : uncontrolledValue,
  )
  const [fallback] = useState(todayDate)
  const rules = dayRules({ min, max, isDateUnavailable })

  function commit(next: SegmentDate | undefined) {
    const iso = next ? toIsoDate(next) : undefined
    if (valueProp === undefined) setUncontrolledValue(iso)
    onValueChange?.(iso)
  }

  const outOfRange = !!value && rules.isBlocked(value)

  return (
    <FieldRoot
      slot="date-field"
      {...field}
      outOfRange={outOfRange}
      submitValue={value ? toIsoDate(value) : ''}
    >
      <div
        data-slot="date-field-segments"
        className={tDateFieldSegmentsClasses}
      >
        <DateSegments
          kind="date"
          value={value}
          onValueChange={commit}
          fallback={fallback}
          locale={locale}
          disabled={field.disabled}
          readonly={field.readonly}
          invalid={outOfRange}
        />
      </div>
    </FieldRoot>
  )
}
