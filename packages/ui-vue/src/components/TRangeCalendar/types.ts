import type { TDatePreset, TDateRange } from '../../lib/date'
import type { TCalendarBaseProps } from '../TCalendar/types'

export type { TDatePreset, TDateRange }

export interface TRangeCalendarProps extends TCalendarBaseProps {
  /** Initial range when no v-model is bound. */
  defaultValue?: TDateRange
  /** Ranges offered in a list beside the grid; picking one sets the range and shows its first month. */
  presets?: TDatePreset[]
  /** Accessible name of the presets list. */
  presetsLabel?: string
}
