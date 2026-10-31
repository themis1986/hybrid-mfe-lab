import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import type { tSectionBodyVariants, tSectionVariants } from './TSection.variants'

export interface TSectionProps
  extends Omit<ComponentProps<'section'>, 'title'>,
    VariantProps<typeof tSectionVariants>,
    VariantProps<typeof tSectionBodyVariants> {
  /** Heading content. Without it, no heading element renders. */
  title?: ReactNode
  /** Muted text under the heading. */
  description?: ReactNode
  /** The heading element, h2–h6. It doesn't change the heading's size. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /**
   * Render the single child element instead of a <section>, merging these props onto it (Radix Slot).
   * The heading and body render inside it, and its own children go in the body.
   */
  asChild?: boolean
}
