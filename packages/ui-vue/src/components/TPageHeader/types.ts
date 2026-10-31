import type { AsTag } from 'reka-ui'
import type { Component } from 'vue'

export interface TPageHeaderProps {
  /** The page title (or use the `title` slot). */
  title?: string
  /** Muted text under the title (or use the `description` slot). */
  description?: string
  /** The title element, h1–h6. It doesn't change the title's size. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** The root element, e.g. 'div'. Defaults to 'header'. */
  as?: AsTag | Component
}
