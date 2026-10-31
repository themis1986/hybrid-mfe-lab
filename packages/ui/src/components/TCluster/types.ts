import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tClusterVariants } from './TCluster.variants'

export interface TClusterProps extends ComponentProps<'div'>, VariantProps<typeof tClusterVariants> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
