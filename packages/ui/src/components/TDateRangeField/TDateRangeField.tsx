import { type CalendarDate } from '@internationalized/date'
import { useState } from 'react'
import { rangeSubmitValue, type TDateRange } from '../../lib/date'
import { dayRules, todayDate } from '../TCalendar/calendarGrid'
import { DateSegments } from '../TDateField/DateSegments'
import { FieldRoot } from '../TDateField/FieldRoot'
import { tDateFieldSegmentsClasses, tDateFieldSeparatorClasses } from '../TDateField/TDateField.variants'
import type { TDateRangeFieldProps } from './types'
import { useRangeDraft } from './useRangeDraft'

// A range typed as two dates in one field, written to behave like Reka's DateRangeField (the Vue library's
// TDateRangeField), with TDateField's keys; Arrow Left/Right cross from the start date to the end date.
// `value` is `{ start, end }` in ISO dates; it changes only once both dates are complete. The form value is
// an ISO interval ('2026-11-01/2026-11-07').
export function TDateRangeField({
  locale = 'en-US',
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  isDateUnavailable,
  ...field
}: TDateRangeFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [fallback] = useState(todayDate)
  const rules = dayRules({ min, max, isDateUnavailable })

  function commit(next: TDateRange | undefined) {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const draft = useRangeDraft(valueProp !== undefined ? valueProp : uncontrolledValue, commit, rules.isBlocked)
  const segments = (which: 'start' | 'end') => (
    <DateSegments
      kind="date"
      value={draft[which]}
      onValueChange={(date) => draft.update(which, date as CalendarDate | undefined)}
      fallback={fallback}
      locale={locale}
      disabled={field.disabled}
      readonly={field.readonly}
      invalid={draft.out}
      rangeType={which}
    />
  )

  return (
    <FieldRoot slot="date-field" {...field} outOfRange={draft.out} submitValue={rangeSubmitValue(draft.complete)}>
      <div data-slot="date-field-segments" className={tDateFieldSegmentsClasses}>
        {segments('start')}
        <span aria-hidden className={tDateFieldSeparatorClasses}>
          –
        </span>
        {segments('end')}
      </div>
    </FieldRoot>
  )
}
