import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tSidebarLayoutVariants } from './TSidebarLayout.variants'

export interface TSidebarLayoutProps extends ComponentProps<'div'>, VariantProps<typeof tSidebarLayoutVariants> {
  /** The sidebar's width beside the content (any CSS length). Defaults to the layout sidebar token. */
  sidebarWidth?: string
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export interface TSidebarLayoutSidebarProps extends ComponentProps<'aside'> {
  /** Render the single child element instead of an <aside>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export interface TSidebarLayoutContentProps extends ComponentProps<'div'> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
