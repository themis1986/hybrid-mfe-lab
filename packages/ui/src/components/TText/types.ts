import type { ComponentProps } from 'react'

export interface TTextProps extends Omit<ComponentProps<'textarea'>, 'size'> {
  /** Visible label, associated with the textarea through `htmlFor`. */
  label: string
  /** Helper text under the textarea. Replaced by `error` while one is set. */
  description?: string
  /** Error text. Marks the textarea as invalid and is announced (`role="alert"`). */
  error?: string
  /** Padding and type size, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Grows with its content instead of scrolling; `rows` is then the minimum height. */
  autoResize?: boolean
  /** With autoResize: the height it stops growing at, in rows. */
  maxRows?: number
}
