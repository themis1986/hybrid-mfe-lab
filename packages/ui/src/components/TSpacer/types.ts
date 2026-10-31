import type { ComponentProps } from 'react'

export interface TSpacerProps extends ComponentProps<'div'> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
