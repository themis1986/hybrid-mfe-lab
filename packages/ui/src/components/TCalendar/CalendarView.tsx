import { type CalendarDate, getLocalTimeZone, isSameDay, isSameMonth, isToday, startOfMonth } from '@internationalized/date'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  type CalendarMonth,
  createMonths,
  dayLabel,
  headingOf,
  isNextDisabled,
  isOutsideVisibleView,
  isPrevDisabled,
  localeWeekStart,
  type WeekStartsOn,
  weekdayNames,
} from './calendarGrid'
import {
  tCalendarBodyClasses,
  tCalendarGridClasses,
  tCalendarHeadCellClasses,
  tCalendarHeaderClasses,
  tCalendarHeadingClasses,
  tCalendarMonthsClasses,
  tCalendarNavClasses,
} from './TCalendar.variants'

export interface CalendarViewProps {
  /** The date focused (and its month shown) first. */
  defaultPlaceholder: CalendarDate
  /** Shows this date's month and focuses it whenever it changes (a value set from outside). */
  showDate?: CalendarDate
  locale: string
  weekStartsOn?: WeekStartsOn
  numberOfMonths?: number
  pagedNavigation?: boolean
  fixedWeeks?: boolean
  min?: CalendarDate
  max?: CalendarDate
  isDateDisabled?: (date: CalendarDate) => boolean
  isDateUnavailable?: (date: CalendarDate) => boolean
  disabled?: boolean
  readonly?: boolean
  label?: string
  prevLabel: string
  nextLabel: string
  /** Focus the selected day, today or the first day once mounted (inside a date picker). */
  initialFocus?: boolean
  isSelected: (date: CalendarDate) => boolean
  /** Extra data attributes for a day's trigger (the range states). */
  dayAttributes?: (date: CalendarDate, unavailable: boolean) => Record<string, true | undefined>
  /** Whether something is selected, and the selected date to focus when the placeholder can't be. */
  hasSelectedDate: boolean
  isSelectedDisabled?: boolean
  selectedFocusable?: CalendarDate
  invalid?: boolean
  onSelect: (date: CalendarDate) => void
  /** The pointer entered, or focus landed on, a day that can be picked. */
  onDayActive?: (date: CalendarDate) => void
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
  /** Rendered before the calendar body, inside the root (a range calendar's presets). */
  before?: ReactNode
  className?: string
  cellClassName: string
  triggerClassName: string
}

// A month grid with the DOM, roles, data attributes and keys of Reka's Calendar parts (the Vue library's
// TCalendar): a root (aria-label "<label>, <heading>") holding a header and one table (role application) per
// month; each day is a role="button" div in a role="gridcell" td, with a roving tabindex. Arrow keys move by
// day and week (skipping disabled days, paging past the visible months), Page Up/Down by month (Shift: year),
// Home/End to the week's ends, Enter or Space selects. The selection itself belongs to the caller.
export function CalendarView(props: CalendarViewProps) {
  const {
    defaultPlaceholder,
    showDate,
    locale,
    numberOfMonths = 1,
    pagedNavigation,
    fixedWeeks = false,
    min,
    max,
    disabled,
    readonly,
    hasSelectedDate,
    isSelectedDisabled,
    selectedFocusable,
  } = props
  const weekStartsOn = props.weekStartsOn ?? localeWeekStart(locale)
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder)
  // The first month shown; the grid is rebuilt from it.
  const [start, setStart] = useState(() => startOfMonth(defaultPlaceholder))
  const startKey = start.toString()
  const months = useMemo(
    () => createMonths(start, numberOfMonths, weekStartsOn, fixedWeeks),
    // startKey stands for start, compared by value.
    [startKey, numberOfMonths, weekStartsOn, fixedWeeks],
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<CalendarDate | undefined>(undefined)
  const [focusRequest, setFocusRequest] = useState(0)
  const pageSize = pagedNavigation ? numberOfMonths : 1

  const isDisabled = (date: CalendarDate) =>
    !!disabled ||
    !!props.isDateDisabled?.(date) ||
    (!!max && date.compare(max) > 0) ||
    (!!min && date.compare(min) < 0)
  const isUnavailable = (date: CalendarDate) => !!props.isDateUnavailable?.(date)
  const prevDisabled = !!disabled || isPrevDisabled(months, min)
  const nextDisabled = !!disabled || isNextDisabled(months, max)

  // A date set from outside: its month is shown (as the first one, when it isn't visible).
  const showKey = showDate?.toString()
  useEffect(() => {
    if (!showDate) return
    setPlaceholder(showDate)
    if (isOutsideVisibleView(showDate, months)) setStart(startOfMonth(showDate))
    // showKey stands for showDate, compared by value.
  }, [showKey])

  useEffect(() => {
    const date = pendingFocus.current
    if (!date) return
    pendingFocus.current = undefined
    rootRef.current?.querySelector<HTMLElement>(`[data-value="${date}"]:not([data-outside-view])`)?.focus()
  }, [focusRequest, months])

  useEffect(() => {
    if (!props.initialFocus) return
    const root = rootRef.current
    const target =
      root?.querySelector<HTMLElement>('[data-selected]:not([data-outside-view])') ??
      root?.querySelector<HTMLElement>('[data-today]:not([data-outside-view])') ??
      root?.querySelector<HTMLElement>('[data-value]:not([data-outside-view]):not([data-disabled])')
    target?.focus()
  }, [])

  function page(sign: 1 | -1) {
    const next = start.add({ months: sign * pageSize })
    setStart(next)
    setPlaceholder(next)
  }

  // Pages towards `date` until it is visible (unless a bound stops it), then focuses it.
  function focusDate(date: CalendarDate) {
    let first = start
    let shown: CalendarMonth[] = months
    for (let i = 0; i < 240 && isOutsideVisibleView(date, shown); i++) {
      const forward = date.compare(first) > 0
      if (forward ? isNextDisabled(shown, max) : isPrevDisabled(shown, min)) return
      first = first.add({ months: (forward ? 1 : -1) * pageSize })
      shown = createMonths(first, numberOfMonths, weekStartsOn, fixedWeeks)
    }
    if (first !== start) setStart(first)
    setPlaceholder(date)
    pendingFocus.current = date
    setFocusRequest((n) => n + 1)
  }

  const outOfBounds = (date: CalendarDate) => (!!min && date.compare(min) < 0) || (!!max && date.compare(max) > 0)

  // Arrow keys: the next day `add` days away that isn't disabled; nothing past min or max.
  function shiftFocus(day: CalendarDate, add: number) {
    let candidate = day.add({ days: add })
    while (!outOfBounds(candidate) && isDisabled(candidate)) candidate = candidate.add({ days: add })
    if (!outOfBounds(candidate)) focusDate(candidate)
  }

  const clamp = (date: CalendarDate) => (min && date.compare(min) < 0 ? min : max && date.compare(max) > 0 ? max : date)
  const weekday = (date: CalendarDate) => date.toDate('UTC').getUTCDay()

  function onDayKeyDown(day: CalendarDate, event: KeyboardEvent<HTMLDivElement>) {
    if (isDisabled(day)) return
    const select = event.key === 'Enter' || event.key === ' '
    if (select && (event.ctrlKey || event.metaKey || event.altKey)) return
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']
    if (!select && !keys.includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    const sign = rootRef.current && getComputedStyle(rootRef.current).direction === 'rtl' ? -1 : 1
    const fromWeekStart = (weekday(day) - weekStartsOn + 7) % 7
    switch (event.key) {
      case 'ArrowRight':
        return shiftFocus(day, sign)
      case 'ArrowLeft':
        return shiftFocus(day, -sign)
      case 'ArrowUp':
        return shiftFocus(day, -7)
      case 'ArrowDown':
        return shiftFocus(day, 7)
      case 'Home':
        return focusDate(clamp(day.subtract({ days: fromWeekStart })))
      case 'End':
        return focusDate(clamp(day.add({ days: 6 - fromWeekStart })))
      case 'PageUp':
      case 'PageDown': {
        const amount = event.shiftKey ? { years: 1 } : { months: 1 }
        return focusDate(clamp(event.key === 'PageUp' ? day.subtract(amount) : day.add(amount)))
      }
      default:
        return choose(day)
    }
  }

  function choose(day: CalendarDate) {
    if (readonly || isDisabled(day) || isUnavailable(day)) return
    setPlaceholder(day)
    props.onSelect(day)
  }

  const placeholderFocusable = !(
    isDisabled(placeholder) ||
    isUnavailable(placeholder) ||
    isOutsideVisibleView(placeholder, months)
  )
  const firstFocusable = months
    .flatMap((month) => month.rows.flat().filter((day) => isSameMonth(day, month.value)))
    .find((day) => !isDisabled(day) && !isUnavailable(day))
  function isFocused(day: CalendarDate, outsideView: boolean) {
    if (outsideView || isDisabled(day)) return false
    if (!disabled && placeholderFocusable && isSameDay(day, placeholder)) return true
    if (!disabled && selectedFocusable && !placeholderFocusable) return isSameDay(day, selectedFocusable)
    if ((!hasSelectedDate || isSelectedDisabled) && !placeholderFocusable) return !!firstFocusable && isSameDay(day, firstFocusable)
    return false
  }

  const heading = headingOf(months, locale)
  const fullLabel = `${props.label ?? 'Event Date'}, ${heading}`
  const weekdays = weekdayNames(months, locale)
  const tz = getLocalTimeZone()

  return (
    <div
      ref={rootRef}
      data-slot="calendar"
      aria-label={fullLabel}
      data-readonly={readonly ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={props.invalid ? '' : undefined}
      className={props.className}
      onKeyDown={props.onKeyDown}
    >
      {props.before}
      <div data-slot="calendar-body" className={tCalendarBodyClasses}>
        <div data-slot="calendar-header" className={tCalendarHeaderClasses}>
          <TButton
            variant="ghost"
            size="sm"
            aria-label={props.prevLabel}
            aria-disabled={prevDisabled || undefined}
            data-disabled={prevDisabled || undefined}
            disabled={prevDisabled}
            className={tCalendarNavClasses}
            onClick={() => page(-1)}
          >
            <TIcon icon={ChevronLeft} size="sm" className="rtl:-scale-x-100" />
          </TButton>
          <div data-disabled={disabled ? '' : undefined} className={tCalendarHeadingClasses}>
            {heading}
          </div>
          <TButton
            variant="ghost"
            size="sm"
            aria-label={props.nextLabel}
            aria-disabled={nextDisabled || undefined}
            data-disabled={nextDisabled || undefined}
            disabled={nextDisabled}
            className={tCalendarNavClasses}
            onClick={() => page(1)}
          >
            <TIcon icon={ChevronRight} size="sm" className="rtl:-scale-x-100" />
          </TButton>
        </div>
        <div data-slot="calendar-months" className={tCalendarMonthsClasses}>
          {months.map((month) => (
            <table
              key={month.value.toString()}
              role="application"
              tabIndex={-1}
              aria-readonly={readonly || undefined}
              aria-disabled={disabled || undefined}
              data-readonly={readonly ? '' : undefined}
              data-disabled={disabled ? '' : undefined}
              className={tCalendarGridClasses}
            >
              <thead aria-hidden>
                <tr>
                  {weekdays.map((name, i) => (
                    <th key={i} className={tCalendarHeadCellClasses}>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {month.rows.map((week) => (
                  <tr key={week[0].toString()}>
                    {week.map((day) => {
                      const dayDisabled = isDisabled(day)
                      const unavailable = isUnavailable(day)
                      const selected = props.isSelected(day)
                      const outsideView = !isSameMonth(day, month.value)
                      const focused = isFocused(day, outsideView)
                      return (
                        <td
                          key={day.toString()}
                          role="gridcell"
                          aria-selected={selected || undefined}
                          aria-disabled={dayDisabled || unavailable}
                          data-disabled={dayDisabled ? '' : undefined}
                          className={props.cellClassName}
                        >
                          <div
                            role="button"
                            aria-label={dayLabel(day, locale)}
                            data-reka-calendar-cell-trigger=""
                            aria-disabled={dayDisabled || unavailable || undefined}
                            data-selected={selected || undefined}
                            data-value={day.toString()}
                            data-disabled={dayDisabled ? '' : undefined}
                            data-unavailable={unavailable ? '' : undefined}
                            data-today={isToday(day, tz) ? '' : undefined}
                            data-outside-view={outsideView ? '' : undefined}
                            data-outside-visible-view={isOutsideVisibleView(day, months) ? '' : undefined}
                            data-focused={focused ? '' : undefined}
                            {...props.dayAttributes?.(day, unavailable)}
                            tabIndex={focused ? 0 : outsideView || dayDisabled ? undefined : -1}
                            className={props.triggerClassName}
                            onClick={() => !dayDisabled && choose(day)}
                            onKeyDown={(event) => onDayKeyDown(day, event)}
                            onFocus={() => !dayDisabled && !unavailable && props.onDayActive?.(day)}
                            onMouseEnter={() => !dayDisabled && !unavailable && props.onDayActive?.(day)}
                          >
                            {day.day.toLocaleString(locale)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
      <div className="sr-only">
        <div role="heading" aria-level={2}>
          {fullLabel}
        </div>
      </div>
    </div>
  )
}
