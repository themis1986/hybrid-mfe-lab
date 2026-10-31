import type { ComponentProps, ReactNode } from 'react'

export interface TPageHeaderProps extends Omit<ComponentProps<'header'>, 'title'> {
  /** The page title. */
  title?: ReactNode
  /** Muted text under the title. */
  description?: ReactNode
  /** Rendered in the actions area, at the end of the row. */
  actions?: ReactNode
  /** The title element, h1–h6. It doesn't change the title's size. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * Render the single child element instead of a <header> (e.g. a <div>), merging these props onto it
   * (Radix Slot). Its own children go under the description.
   */
  asChild?: boolean
}
