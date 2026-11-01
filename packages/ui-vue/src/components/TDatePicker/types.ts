import type { TCalendarBaseProps } from '../TCalendar/types'
import type { TDateFieldBaseProps } from '../TDateField/types'

/** What both date pickers take besides the field's and the calendar's props. */
export interface TPickerProps {
  /** Open the calendar when first rendered, when no v-model:open is bound. */
  defaultOpen?: boolean
  /** Close the calendar once a date (a range's end) is picked. */
  closeOnSelect?: boolean
  /** Accessible name of the calendar button. */
  triggerLabel?: string
}

export interface TDatePickerProps extends TDateFieldBaseProps, TCalendarBaseProps, TPickerProps {
  /** Initial value when no v-model is bound. */
  defaultValue?: string
}
