import { useState } from 'react'
import { cn } from '../../lib/cn'
import type { TDateRange } from '../../lib/date'
import { CalendarView } from '../TCalendar/CalendarView'
import { dayRules, todayDate } from '../TCalendar/calendarGrid'
import {
  tCalendarCellClasses,
  tCalendarCellTriggerClasses,
  tCalendarFrameClasses,
  tCalendarRootClasses,
} from '../TCalendar/TCalendar.variants'
import { RangePresets } from './RangePresets'
import { tRangeCalendarCellClasses, tRangeCalendarCellTriggerClasses } from './TRangeCalendar.variants'
import type { TRangeCalendarProps } from './types'
import { useRangeSelection } from './useRangeSelection'

export const rangeCellClassName = cn(tCalendarCellClasses, tRangeCalendarCellClasses)
export const rangeTriggerClassName = cn(tCalendarCellTriggerClasses, tRangeCalendarCellTriggerClasses)

// A month grid that picks a range of dates, written to behave like Reka's RangeCalendar (the Vue library's
// TRangeCalendar): the first pick sets the start, the days up to the pointer or the focused day are previewed,
// the second pick sets the end (picks in either order). `value` is `{ start, end }` in ISO dates; it changes
// only once both ends are picked. Escape while picking returns to the last range. The keys are TCalendar's.
export function TRangeCalendar({
  locale = 'en-US',
  numberOfMonths = 1,
  prevLabel = 'Previous month',
  nextLabel = 'Next month',
  presetsLabel = 'Presets',
  presets,
  className,
  ...props
}: TRangeCalendarProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(props.defaultValue)
  const value = props.value !== undefined ? props.value : uncontrolledValue
  const rules = dayRules(props)

  function commit(next: TDateRange | undefined) {
    if (props.value === undefined) setUncontrolledValue(next)
    props.onValueChange?.(next)
  }

  const selection = useRangeSelection({ value, onCommit: commit, isBlocked: rules.isBlocked, isDisabled: rules.isDisabled })

  return (
    <CalendarView
      defaultPlaceholder={selection.start ?? todayDate()}
      showDate={selection.start}
      locale={locale}
      weekStartsOn={props.weekStartsOn}
      numberOfMonths={numberOfMonths}
      pagedNavigation={props.pagedNavigation}
      fixedWeeks={props.fixedWeeks}
      min={rules.min}
      max={rules.max}
      isDateDisabled={rules.isDateDisabled}
      isDateUnavailable={rules.isDateUnavailable}
      disabled={props.disabled}
      readonly={props.readonly}
      label={props.label}
      prevLabel={prevLabel}
      nextLabel={nextLabel}
      isSelected={selection.isSelected}
      dayAttributes={selection.dayAttributes}
      hasSelectedDate={selection.hasSelectedDate}
      isSelectedDisabled={selection.isSelectedDisabled}
      selectedFocusable={selection.selectedFocusable}
      invalid={selection.invalid}
      onSelect={selection.select}
      onDayActive={selection.onDayActive}
      onKeyDown={selection.onKeyDown}
      before={
        presets?.length ? (
          <RangePresets
            presets={presets}
            label={presetsLabel}
            value={value}
            disabled={props.disabled || props.readonly}
            onSelect={commit}
          />
        ) : null
      }
      className={cn(tCalendarRootClasses, tCalendarFrameClasses, className)}
      cellClassName={rangeCellClassName}
      triggerClassName={rangeTriggerClassName}
    />
  )
}
