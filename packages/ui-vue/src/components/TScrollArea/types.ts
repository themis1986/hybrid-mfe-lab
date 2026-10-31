import type { PrimitiveProps } from 'reka-ui'

export interface TScrollAreaProps extends PrimitiveProps {
  /** Which axis scrolls. */
  orientation?: 'vertical' | 'horizontal' | 'both'
  /** The height past which the content scrolls (any CSS length). */
  maxHeight?: string
}
