import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tCardVariants } from './TCard.variants'

export interface TCardProps extends ComponentProps<'div'>, VariantProps<typeof tCardVariants> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export interface TCardPartProps extends ComponentProps<'div'> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export type TCardHeaderProps = TCardPartProps
export type TCardBodyProps = TCardPartProps
export type TCardFooterProps = TCardPartProps
