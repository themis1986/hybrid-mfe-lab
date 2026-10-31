import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tScrollAreaVariants } from './TScrollArea.variants'

export interface TScrollAreaProps extends ComponentProps<'div'>, VariantProps<typeof tScrollAreaVariants> {
  /** The height past which the content scrolls (any CSS length). */
  maxHeight?: string
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
