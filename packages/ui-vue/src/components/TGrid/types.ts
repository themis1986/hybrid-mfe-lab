import type { PrimitiveProps } from 'reka-ui'
import type { Space } from '../../lib/layout'

export interface TGridProps extends PrimitiveProps {
  /** A fixed number of equal columns. Ignored when minChildWidth is set. */
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  /** Auto-fit columns at least this wide (any CSS length); they drop to one column when narrow. */
  minChildWidth?: string
  /** Space between items: steps 0–8 of the spacing scale (0–64px). */
  gap?: Space
}
