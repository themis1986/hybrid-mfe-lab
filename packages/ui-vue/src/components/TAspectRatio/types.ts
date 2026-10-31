import type { PrimitiveProps } from 'reka-ui'

export interface TAspectRatioProps extends PrimitiveProps {
  /** A preset, or a number: width divided by height (e.g. 1.5). */
  ratio?: 'square' | '4-3' | '3-2' | '16-9' | '21-9' | number
}
