import type { PrimitiveProps } from 'reka-ui'
import type { TPaginationLabels } from '../../lib/pagination'

// `as` only: the component renders its own list inside the root.
export interface TPaginationProps {
  /** The page shown first when no v-model:page is bound. */
  defaultPage?: number
  /** Number of items in the whole list, not of pages. */
  total: number
  itemsPerPage: number
  /** Pages shown on each side of the current one. */
  siblingCount?: number
  /** Always show the first and last page, with an ellipsis for any gap. */
  showEdges?: boolean
  /** Add buttons that jump to the first and last page. */
  showFirstLast?: boolean
  /** Height of the buttons. */
  size?: 'sm' | 'md' | 'lg'
  /** Disables every button. */
  disabled?: boolean
  /** Accessible names of the buttons, for translating them. */
  labels?: Partial<TPaginationLabels>
  /** The element or component to render. */
  as?: PrimitiveProps['as']
}
