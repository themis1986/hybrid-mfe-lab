import type { PrimitiveProps } from 'reka-ui'
import type { Align, Justify, Space } from '../../lib/layout'

export interface TClusterProps extends PrimitiveProps {
  /** Space between items: steps 0–8 of the spacing scale (0–64px). */
  gap?: Space
  /** Cross-axis alignment (align-items). */
  align?: Align
  /** Main-axis distribution (justify-content). */
  justify?: Justify
}
