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
  /** The hidden form input's id, for a <label htmlFor> (focusing it focuses the first segment). */
  id?: string
  /** Merged onto the field (the box around the segments). */
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
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
  /** An ISO date ('2026-11-01'); undefined until every segment is filled. */
  value?: string
  /** Initial value when `value` isn't set. */
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
}
