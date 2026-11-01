import type { TDatePreset, TDateRange } from '../../lib/date'
import type { TCalendarBaseProps } from '../TCalendar/types'

export type { TDatePreset, TDateRange }

export interface TRangeCalendarProps extends TCalendarBaseProps {
  /** The range, in ISO dates; it changes only once both ends are picked. */
  value?: TDateRange
  /** Initial range when `value` isn't set. */
  defaultValue?: TDateRange
  onValueChange?: (value: TDateRange | undefined) => void
  /** Ranges offered in a list beside the grid; picking one sets the range and shows its first month. */
  presets?: TDatePreset[]
  /** Accessible name of the presets list. */
  presetsLabel?: string
  /** Merged onto the root. */
  className?: string
}
