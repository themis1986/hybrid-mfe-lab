import type { TDateRange } from '../../lib/date'
import type { TDateFieldBaseProps } from '../TDateField/types'

export interface TDateRangeFieldProps extends TDateFieldBaseProps {
  /** Initial range when no v-model is bound. */
  defaultValue?: TDateRange
}
