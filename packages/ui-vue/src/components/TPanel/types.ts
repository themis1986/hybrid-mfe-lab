import type { AsTag } from 'reka-ui'
import type { Component } from 'vue'
import type { Space } from '../../lib/layout'

export interface TPanelProps {
  /** Surface or accent-subtle background. */
  tone?: 'neutral' | 'accent'
  /** Inner padding (0–8). */
  padding?: Space
  /** A small title above the content (or use the `title` slot). */
  title?: string
  /** The root element. Defaults to 'div'. */
  as?: AsTag | Component
}
