import { type CalendarDate } from '@internationalized/date'
import * as Popover from '@radix-ui/react-popover'
import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { rangeSubmitValue, type TDateRange } from '../../lib/date'
import { CalendarView } from '../TCalendar/CalendarView'
import { dayRules, todayDate } from '../TCalendar/calendarGrid'
import { tCalendarRootClasses } from '../TCalendar/TCalendar.variants'
import { DateSegments } from '../TDateField/DateSegments'
import { FieldRoot } from '../TDateField/FieldRoot'
import {
  tDateFieldSegmentsClasses,
  tDateFieldSeparatorClasses,
  tDateFieldTriggerClasses,
} from '../TDateField/TDateField.variants'
import { tDatePickerContentClasses } from '../TDatePicker/TDatePicker.variants'
import { pickerContentStyle, usePickerOpen } from '../TDatePicker/usePickerOpen'
import { useRangeDraft } from '../TDateRangeField/useRangeDraft'
import { TIcon } from '../TIcon'
import { RangePresets } from '../TRangeCalendar/RangePresets'
import { rangeCellClassName, rangeTriggerClassName } from '../TRangeCalendar/TRangeCalendar'
import { useRangeSelection } from '../TRangeCalendar/useRangeSelection'
import type { TRangeDatePickerProps } from './types'

// A range field with a calendar button, written to behave like Reka's DateRangePicker (the Vue library's
// TRangeDatePicker): type both dates as in TDateRangeField, or open the calendar (a Radix Popover anchored on
// the field) and pick the start and the end there as in TRangeCalendar, or pick a preset. `value` is
// `{ start, end }` in ISO dates and changes only once both ends are set; the form value is an ISO interval
// ('2026-11-01/2026-11-07').
export function TRangeDatePicker({
  locale = 'en-US',
  numberOfMonths = 1,
  prevLabel = 'Previous month',
  nextLabel = 'Next month',
  closeOnSelect = true,
  triggerLabel = 'Open calendar',
  presetsLabel = 'Presets',
  presets,
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
}: TRangeDatePickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = valueProp !== undefined ? valueProp : uncontrolledValue
  const [isOpen, setOpen] = usePickerOpen({ open, defaultOpen, onOpenChange })
  const [fallback] = useState(todayDate)
  const rules = dayRules({ min, max, disabled: field.disabled, isDateDisabled, isDateUnavailable })

  function commit(next: TDateRange | undefined) {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  // A range completed in the calendar, or a preset, closes it.
  function pick(next: TDateRange | undefined) {
    commit(next)
    if (next && closeOnSelect) setOpen(false)
  }

  const draft = useRangeDraft(value, commit, dayRules({ min, max, isDateUnavailable }).isBlocked)
  const selection = useRangeSelection({ value, onCommit: pick, isBlocked: rules.isBlocked, isDisabled: rules.isDisabled })

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
    <Popover.Root open={isOpen} onOpenChange={(next) => setOpen(next && !field.disabled)}>
      <Popover.Anchor asChild>
        <FieldRoot
          slot="date-picker-field"
          {...field}
          outOfRange={draft.out}
          submitValue={rangeSubmitValue(draft.complete)}
        >
          <div data-slot="date-field-segments" className={tDateFieldSegmentsClasses}>
            {segments('start')}
            <span aria-hidden className={tDateFieldSeparatorClasses}>
              –
            </span>
            {segments('end')}
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
          // The calendar focuses the range's start (or today) itself.
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <CalendarView
            initialFocus
            defaultPlaceholder={selection.start ?? todayDate()}
            showDate={selection.start}
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
                  disabled={field.disabled || field.readonly}
                  onSelect={pick}
                />
              ) : null
            }
            className={tCalendarRootClasses}
            cellClassName={rangeCellClassName}
            triggerClassName={rangeTriggerClassName}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
