import { isSameDay } from '@internationalized/date'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { parseIsoDate, toIsoDate, toMatcher } from '../../lib/date'
import { CalendarView } from './CalendarView'
import { todayDate } from './calendarGrid'
import {
  tCalendarCellClasses,
  tCalendarCellTriggerClasses,
  tCalendarFrameClasses,
  tCalendarRootClasses,
  tCalendarSelectedClasses,
} from './TCalendar.variants'
import type { TCalendarProps } from './types'

const triggerClassName = cn(
  tCalendarCellTriggerClasses,
  tCalendarSelectedClasses,
)

// A month grid that picks one date. Radix has no calendar, so this is CalendarView, written to behave like
// Reka's Calendar (the Vue library's TCalendar): arrow keys move by day and week, Page Up/Down by month (with
// Shift, by year), Home/End to the week's ends; Enter or Space picks, and picking the picked date again clears
// it. `value` is an ISO date ('2026-11-01'), undefined while none is picked.
export function TCalendar({
  locale = 'en-US',
  numberOfMonths = 1,
  prevLabel = 'Previous month',
  nextLabel = 'Next month',
  className,
  ...props
}: TCalendarProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(props.defaultValue)
  const selected = parseIsoDate(
    props.value !== undefined ? props.value : uncontrolledValue,
  )
  const min = parseIsoDate(props.min)
  const max = parseIsoDate(props.max)
  const isDateDisabled = toMatcher(props.isDateDisabled)
  const isDateUnavailable = toMatcher(props.isDateUnavailable)

  function commit(next: string | undefined) {
    if (props.value === undefined) setUncontrolledValue(next)
    props.onValueChange?.(next)
  }

  return (
    <CalendarView
      defaultPlaceholder={selected ?? todayDate()}
      showDate={selected}
      locale={locale}
      weekStartsOn={props.weekStartsOn}
      numberOfMonths={numberOfMonths}
      pagedNavigation={props.pagedNavigation}
      fixedWeeks={props.fixedWeeks}
      min={min}
      max={max}
      isDateDisabled={isDateDisabled}
      isDateUnavailable={isDateUnavailable}
      disabled={props.disabled}
      readonly={props.readonly}
      label={props.label}
      prevLabel={prevLabel}
      nextLabel={nextLabel}
      isSelected={(date) => !!selected && isSameDay(date, selected)}
      hasSelectedDate={!!selected}
      isSelectedDisabled={!!selected && !!isDateDisabled?.(selected)}
      invalid={
        !!selected &&
        (!!isDateDisabled?.(selected) || !!isDateUnavailable?.(selected))
      }
      onSelect={(date) =>
        commit(
          selected && isSameDay(date, selected) ? undefined : toIsoDate(date),
        )
      }
      className={cn(tCalendarRootClasses, tCalendarFrameClasses, className)}
      cellClassName={tCalendarCellClasses}
      triggerClassName={triggerClassName}
    />
  )
}
