import type { TDatePreset, TDateRange } from '../../lib/date'
import type { TCalendarBaseProps } from '../TCalendar/types'
import type { TDateFieldBaseProps } from '../TDateField/types'
import type { TPickerProps } from '../TDatePicker/types'

export interface TRangeDatePickerProps
  extends TDateFieldBaseProps, TCalendarBaseProps, TPickerProps {
  /** Initial range when no v-model is bound. */
  defaultValue?: TDateRange
  /** Ranges offered in a list beside the calendar; picking one sets the range. */
  presets?: TDatePreset[]
  /** Accessible name of the presets list. */
  presetsLabel?: string
}
