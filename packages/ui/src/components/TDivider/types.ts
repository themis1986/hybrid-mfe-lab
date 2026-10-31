import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tDividerVariants } from './TDivider.variants'

export interface TDividerProps extends ComponentProps<'hr'>, VariantProps<typeof tDividerVariants> {
  /** Render the single child element instead of an <hr>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
