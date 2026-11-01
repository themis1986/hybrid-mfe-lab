export interface TTextProps {
  /** Visible label, associated with the textarea. */
  label: string
  /** Helper text under the textarea. Replaced by `error` while one is set. */
  description?: string
  /** Error text. Marks the textarea as invalid and is announced (`role="alert"`). */
  error?: string
  /** The textarea's id. Generated when omitted. */
  id?: string
  /** Padding and type size, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Visible lines (the minimum with autoResize). */
  rows?: number
  /** Grows with its content instead of scrolling. */
  autoResize?: boolean
  /** With autoResize: the height it stops growing at, in rows. */
  maxRows?: number
  /** Limits the length and shows a character count. */
  maxLength?: number
}
