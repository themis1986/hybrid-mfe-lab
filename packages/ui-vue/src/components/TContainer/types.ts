import type { PrimitiveProps } from 'reka-ui'

export interface TContainerProps extends PrimitiveProps {
  /** Max width: 640, 960 or 1200px, or none. */
  size?: 'sm' | 'md' | 'lg' | 'full'
}
