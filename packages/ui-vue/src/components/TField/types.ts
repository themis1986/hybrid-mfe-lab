import type { TInputProps } from '../TInput'

export interface TFieldProps extends TInputProps {
  /** Visible label, associated with the input. */
  label: string
  /** Helper text under the input. Replaced by `error` while one is set. */
  description?: string
  /** Error text. Marks the input as invalid and is announced (`role="alert"`). */
  error?: string
  /** The input's id. Generated when omitted. */
  id?: string
}
