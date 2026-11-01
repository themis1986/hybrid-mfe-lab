import type { TTimeGranularity } from '../../lib/date'
import type { TSegmentedFieldProps } from '../TDateField/types'

export type { TTimeGranularity }

export interface TTimeFieldProps extends TSegmentedFieldProps {
  /** Initial value when no v-model is bound: '14:30', or '14:30:15' with seconds. */
  defaultValue?: string
  /** The smallest segment shown; 'hour' still keeps minutes in the value, as :00. */
  granularity?: TTimeGranularity
  /** 12 adds an AM/PM segment; the locale's cycle by default. */
  hourCycle?: 12 | 24
  /** The earliest time allowed; an earlier one marks the field invalid. */
  min?: string
  /** The latest time allowed; a later one marks the field invalid. */
  max?: string
}
