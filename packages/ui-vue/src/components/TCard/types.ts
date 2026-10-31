import type { PrimitiveProps } from 'reka-ui'
import type { Space } from '../../lib/layout'

export interface TCardProps extends PrimitiveProps {
  /** Transparent, surface fill, or canvas with a shadow. */
  variant?: 'outline' | 'filled' | 'elevated'
  /** Padding and the space between parts (0–8). Use this, not a p-* class, or the parts drift. */
  padding?: Space
}

export interface TCardHeaderProps extends PrimitiveProps {}
export interface TCardBodyProps extends PrimitiveProps {}
export interface TCardFooterProps extends PrimitiveProps {}
