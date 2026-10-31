import type { PrimitiveProps } from 'reka-ui'

export interface TDividerProps extends PrimitiveProps {
  /** Vertical also sets aria-orientation. */
  orientation?: 'horizontal' | 'vertical'
}
