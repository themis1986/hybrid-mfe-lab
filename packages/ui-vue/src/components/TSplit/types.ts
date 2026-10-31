import type { PrimitiveProps } from 'reka-ui'
import type { Space } from '../../lib/layout'

export interface TSplitProps extends PrimitiveProps {
  /** Width ratio of the two panes. */
  ratio?: '1-1' | '1-2' | '2-1'
  /** The narrowest a pane gets before the panes stack (any CSS length). Defaults to 20rem. */
  minPaneWidth?: string
  /** Space between items: steps 0–8 of the spacing scale (0–64px). */
  gap?: Space
}
