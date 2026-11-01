import type { AsTag } from 'reka-ui'
import type { Component } from 'vue'
import type { Space } from '../../lib/layout'

export interface TWidgetProps {
  /** The widget's name: shown in the header by default, and names the expand button and the dialog. */
  title: string
  /** Initial expanded state when no v-model:expanded is bound. */
  defaultExpanded?: boolean
  /** Size of the expanded view (a TDialogContent size). */
  expandedSize?: 'sm' | 'md' | 'lg' | 'full'
  /** The expand button's accessible name is this, followed by the title. */
  expandLabel?: string
  /** The default heading element, h2–h6. It doesn't change the heading's size. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Card look: transparent, surface fill, or canvas with a shadow. */
  variant?: 'outline' | 'filled' | 'elevated'
  /** Card padding and the space between header and content (0–8). */
  padding?: Space
  /** The card's root element. The header and body render inside it. */
  as?: AsTag | Component
}
