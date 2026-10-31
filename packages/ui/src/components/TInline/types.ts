import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tInlineVariants } from './TInline.variants'

export interface TInlineProps extends ComponentProps<'div'>, VariantProps<typeof tInlineVariants> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
