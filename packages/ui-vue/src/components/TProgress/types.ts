export interface TProgressProps {
  /** The amount done, out of `max`. null or omitted: indeterminate. */
  value?: number | null
  max?: number
  /** Bar height. */
  size?: 'sm' | 'md'
  /** The bar's colour. */
  tone?: 'accent' | 'success' | 'info' | 'warning' | 'danger'
  /** The spoken value; the percentage by default. */
  getValueLabel?: (
    value: number | null | undefined,
    max: number,
  ) => string | undefined
}
