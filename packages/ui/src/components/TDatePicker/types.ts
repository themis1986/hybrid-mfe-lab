import type { TCalendarBaseProps } from '../TCalendar/types'
import type { TDateFieldBaseProps } from '../TDateField/types'

/** What both date pickers take besides the field's and the calendar's props. */
export interface TPickerProps {
  /** Whether the calendar is open (controlled). */
  open?: boolean
  /** Open the calendar when first rendered, when `open` isn't set. */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Close the calendar once a date (a range's end) is picked. */
  closeOnSelect?: boolean
  /** Accessible name of the calendar button. */
  triggerLabel?: string
}

export interface TDatePickerProps extends TDateFieldBaseProps, TCalendarBaseProps, TPickerProps {
  /** An ISO date ('2026-11-01'). */
  value?: string
  /** Initial value when `value` isn't set. */
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
}
