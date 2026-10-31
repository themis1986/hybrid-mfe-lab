import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tSplitVariants } from './TSplit.variants'

export interface TSplitProps extends ComponentProps<'div'>, VariantProps<typeof tSplitVariants> {
  /** The narrowest a pane gets before the panes stack (any CSS length). Defaults to 20rem. */
  minPaneWidth?: string
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
