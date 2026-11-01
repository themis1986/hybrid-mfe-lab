import type { TDateRange } from '../../lib/date'
import type { TDateFieldBaseProps } from '../TDateField/types'

export interface TDateRangeFieldProps extends TDateFieldBaseProps {
  /** The range, in ISO dates; it changes only once both dates are complete. */
  value?: TDateRange
  /** Initial range when `value` isn't set. */
  defaultValue?: TDateRange
  onValueChange?: (value: TDateRange | undefined) => void
}
