import type { AsTag } from 'reka-ui'
import type { Component } from 'vue'
import type { Space } from '../../lib/layout'

export interface TSectionProps {
  /** Heading text (or use the `title` slot). Without either, no heading element renders. */
  title?: string
  /** Muted text under the heading (or use the `description` slot). */
  description?: string
  /** The heading element, h2–h6. It doesn't change the heading's size. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Space between the body items (0–8). */
  gap?: Space
  /** Vertical padding of the section (0–8). */
  spacing?: Space
  /** The root element, e.g. 'article'. The heading and body render inside it. */
  as?: AsTag | Component
}
