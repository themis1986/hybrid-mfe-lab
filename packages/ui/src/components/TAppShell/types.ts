import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tAppShellVariants } from './TAppShell.variants'

export interface TAppShellProps extends ComponentProps<'div'>, VariantProps<typeof tAppShellVariants> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export interface TAppShellHeaderProps extends ComponentProps<'header'> {
  /** Render the single child element instead of a <header>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export interface TAppShellSidebarProps extends ComponentProps<'aside'> {
  /** Render the single child element instead of an <aside>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export interface TAppShellMainProps extends ComponentProps<'main'> {
  /** Render the single child element instead of a <main>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export interface TAppShellFooterProps extends ComponentProps<'footer'> {
  /** Render the single child element instead of a <footer>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
