import type { TTimeGranularity } from '../../lib/date'
import type { TSegmentedFieldProps } from '../TDateField/types'

export type { TTimeGranularity }

export interface TTimeFieldProps extends TSegmentedFieldProps {
  /** An ISO time: '14:30', or '14:30:15' with granularity 'second'; undefined until every segment is filled. */
  value?: string
  /** Initial value when `value` isn't set. */
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
  /** The smallest segment shown; 'hour' still keeps minutes in the value, as :00. */
  granularity?: TTimeGranularity
  /** 12 adds an AM/PM segment; the locale's cycle by default. */
  hourCycle?: 12 | 24
  /** The earliest time allowed; an earlier one marks the field invalid. */
  min?: string
  /** The latest time allowed; a later one marks the field invalid. */
  max?: string
}
