import type { TDateMatcher } from '../../lib/date'

/** What every calendar takes, on its own or inside a date picker. Dates are ISO strings ('2026-11-01'). */
export interface TCalendarBaseProps {
  /** The first date that can be picked. */
  min?: string
  /** The last date that can be picked. */
  max?: string
  /** Dates that can't be picked or focused (shown faded). */
  isDateDisabled?: TDateMatcher
  /** Dates that can be focused but not picked (struck through): booked, closed. */
  isDateUnavailable?: TDateMatcher
  /** Formats the heading, the weekday names and each day's accessible name. */
  locale?: string
  /** First day of the week, 0 = Sunday; the locale's by default. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Months shown side by side (they wrap when narrow). */
  numberOfMonths?: number
  /** Previous/next move by all the months shown, not one. */
  pagedNavigation?: boolean
  /** Always six weeks per month, so the height never changes. */
  fixedWeeks?: boolean
  /** Prevents interaction. */
  disabled?: boolean
  /** Shows the value but doesn't change it. */
  readonly?: boolean
  /** Accessible name of the calendar; the visible month is added to it. */
  label?: string
  /** Accessible name of the previous button. */
  prevLabel?: string
  /** Accessible name of the next button. */
  nextLabel?: string
}

export interface TCalendarProps extends TCalendarBaseProps {
  /** Initial value when no v-model is bound. */
  defaultValue?: string
}
