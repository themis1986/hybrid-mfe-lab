import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import type { tPanelVariants } from './TPanel.variants'

export interface TPanelProps extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof tPanelVariants> {
  /** A small title above the content. */
  title?: ReactNode
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
