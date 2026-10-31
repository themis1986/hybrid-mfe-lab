import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tContainerVariants } from './TContainer.variants'

export interface TContainerProps extends ComponentProps<'div'>, VariantProps<typeof tContainerVariants> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
