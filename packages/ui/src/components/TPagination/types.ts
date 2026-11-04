import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { TPaginationLabels } from '../../lib/pagination'
import type { tPaginationButtonVariants } from './TPagination.variants'

export interface TPaginationProps
  extends
    Omit<ComponentProps<'nav'>, 'children'>,
    VariantProps<typeof tPaginationButtonVariants> {
  /** The current page, from 1. A page past the end shows as the last one; nothing is reported. */
  page?: number
  /** The page shown first when `page` isn't controlled. */
  defaultPage?: number
  /** Called when the user picks another page. */
  onPageChange?: (page: number) => void
  /** Number of items in the whole list, not of pages. */
  total: number
  itemsPerPage: number
  /** Pages shown on each side of the current one. */
  siblingCount?: number
  /** Always show the first and last page, with an ellipsis for any gap. */
  showEdges?: boolean
  /** Add buttons that jump to the first and last page. */
  showFirstLast?: boolean
  /** Disables every button. */
  disabled?: boolean
  /** Accessible names of the buttons, for translating them. */
  labels?: Partial<TPaginationLabels>
}
