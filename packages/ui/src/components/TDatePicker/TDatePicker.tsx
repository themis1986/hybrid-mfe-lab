import { type CalendarDate, isSameDay } from '@internationalized/date'
import * as Popover from '@radix-ui/react-popover'
import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { parseIsoDate, toIsoDate } from '../../lib/date'
import { CalendarView } from '../TCalendar/CalendarView'
import { dayRules, todayDate } from '../TCalendar/calendarGrid'
import {
  tCalendarCellClasses,
  tCalendarCellTriggerClasses,
  tCalendarRootClasses,
  tCalendarSelectedClasses,
} from '../TCalendar/TCalendar.variants'
import { DateSegments } from '../TDateField/DateSegments'
import { FieldRoot } from '../TDateField/FieldRoot'
import { tDateFieldSegmentsClasses, tDateFieldTriggerClasses } from '../TDateField/TDateField.variants'
import { TIcon } from '../TIcon'
import { tDatePickerContentClasses } from './TDatePicker.variants'
import type { TDatePickerProps } from './types'
import { pickerContentStyle, usePickerOpen } from './usePickerOpen'

const triggerClassName = cn(tCalendarCellTriggerClasses, tCalendarSelectedClasses)

// A date field with a calendar button, written to behave like Reka's DatePicker (the Vue library's
// TDatePicker): type the date as in TDateField, or open the calendar (a Radix Popover anchored on the field)
// and pick it there with TCalendar's keys. Opening focuses the selected day, or today; Escape closes and
// returns focus to the button. `value` is an ISO date ('2026-11-01').
export function TDatePicker({
  locale = 'en-US',
  numberOfMonths = 1,
  prevLabel = 'Previous month',
  nextLabel = 'Next month',
  closeOnSelect = true,
  triggerLabel = 'Open calendar',
  value: valueProp,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  min,
  max,
  isDateDisabled,
  isDateUnavailable,
  weekStartsOn,
  pagedNavigation,
  fixedWeeks,
  label,
  ...field
}: TDatePickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = parseIsoDate(valueProp !== undefined ? valueProp : uncontrolledValue)
  const [isOpen, setOpen] = usePickerOpen({ open, defaultOpen, onOpenChange })
  const [fallback] = useState(todayDate)
  const rules = dayRules({ min, max, disabled: field.disabled, isDateDisabled, isDateUnavailable })

  function commit(next: CalendarDate | undefined) {
    const iso = next && toIsoDate(next)
    if (valueProp === undefined) setUncontrolledValue(iso)
    onValueChange?.(iso)
  }

  // Picking the picked date again clears it, as in TCalendar.
  function pick(date: CalendarDate) {
    commit(value && isSameDay(date, value) ? undefined : date)
    if (closeOnSelect) setOpen(false)
  }

  // As in TDateField: an unavailable or out-of-range value marks the field.
  const outOfRange = !!value && dayRules({ min, max, isDateUnavailable }).isBlocked(value)

  return (
    <Popover.Root open={isOpen} onOpenChange={(next) => setOpen(next && !field.disabled)}>
      <Popover.Anchor asChild>
        <FieldRoot slot="date-picker-field" {...field} outOfRange={outOfRange} submitValue={value ? toIsoDate(value) : ''}>
          <div data-slot="date-field-segments" className={tDateFieldSegmentsClasses}>
            <DateSegments
              kind="date"
              value={value}
              onValueChange={(date) => commit(date as CalendarDate | undefined)}
              fallback={fallback}
              locale={locale}
              disabled={field.disabled}
              readonly={field.readonly}
              invalid={outOfRange}
            />
          </div>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label={triggerLabel}
              disabled={field.disabled}
              data-reka-date-field-segment="trigger"
              className={tDateFieldTriggerClasses}
            >
              <TIcon icon={Calendar} size="sm" />
            </button>
          </Popover.Trigger>
        </FieldRoot>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          data-slot="date-picker-content"
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          className={tDatePickerContentClasses}
          style={pickerContentStyle}
          // The calendar focuses its selected day (or today) itself.
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <CalendarView
            initialFocus
            defaultPlaceholder={value ?? todayDate()}
            showDate={value}
            locale={locale}
            weekStartsOn={weekStartsOn}
            numberOfMonths={numberOfMonths}
            pagedNavigation={pagedNavigation}
            fixedWeeks={fixedWeeks}
            min={rules.min}
            max={rules.max}
            isDateDisabled={rules.isDateDisabled}
            isDateUnavailable={rules.isDateUnavailable}
            disabled={field.disabled}
            readonly={field.readonly}
            label={label}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            isSelected={(date) => !!value && isSameDay(date, value)}
            hasSelectedDate={!!value}
            isSelectedDisabled={!!value && rules.isDisabled(value)}
            onSelect={pick}
            className={tCalendarRootClasses}
            cellClassName={tCalendarCellClasses}
            triggerClassName={triggerClassName}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
