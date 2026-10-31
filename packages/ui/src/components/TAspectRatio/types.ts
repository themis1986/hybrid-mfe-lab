import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tAspectRatioVariants } from './TAspectRatio.variants'

export interface TAspectRatioProps extends ComponentProps<'div'> {
  /** A preset, or a number: width divided by height (e.g. 1.5). */
  ratio?: NonNullable<VariantProps<typeof tAspectRatioVariants>['ratio']> | number
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
