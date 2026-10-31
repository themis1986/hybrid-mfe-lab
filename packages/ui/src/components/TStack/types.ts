import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tStackVariants } from './TStack.variants'

export interface TStackProps extends ComponentProps<'div'>, VariantProps<typeof tStackVariants> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
