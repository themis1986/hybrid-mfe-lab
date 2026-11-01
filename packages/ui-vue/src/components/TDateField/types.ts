import type { TDateMatcher } from '../../lib/date'

/** What every segmented field takes (a date, a range or a time), on its own or inside a date picker. */
export interface TSegmentedFieldProps {
  /** Field height and text size, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Marks the field as invalid (`aria-invalid` + error border). An out-of-range value is marked anyway. */
  invalid?: boolean
  /** Prevents interaction. */
  disabled?: boolean
  /** Shows the value but doesn't change it. */
  readonly?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** A complete value must be entered before the owning form submits. */
  required?: boolean
  /** Sets the order of the segments, their placeholders and the separators. */
  locale?: string
}

/** A date field's limits, shared with the date pickers. Dates are ISO strings ('2026-11-01'). */
export interface TDateFieldBaseProps extends TSegmentedFieldProps {
  /** The first date allowed; an earlier one marks the field invalid. */
  min?: string
  /** The last date allowed; a later one marks the field invalid. */
  max?: string
  /** Dates that mark the field invalid when entered. */
  isDateUnavailable?: TDateMatcher
}

export interface TDateFieldProps extends TDateFieldBaseProps {
  /** Initial value when no v-model is bound. */
  defaultValue?: string
}
