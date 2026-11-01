import type { TDatePreset, TDateRange } from '../../lib/date'
import type { TCalendarBaseProps } from '../TCalendar/types'
import type { TDateFieldBaseProps } from '../TDateField/types'
import type { TPickerProps } from '../TDatePicker/types'

export interface TRangeDatePickerProps
  extends TDateFieldBaseProps, TCalendarBaseProps, TPickerProps {
  /** The range, in ISO dates; it changes only once both ends are set. */
  value?: TDateRange
  /** Initial range when `value` isn't set. */
  defaultValue?: TDateRange
  onValueChange?: (value: TDateRange | undefined) => void
  /** Ranges offered in a list beside the calendar; picking one sets the range. */
  presets?: TDatePreset[]
  /** Accessible name of the presets list. */
  presetsLabel?: string
}
