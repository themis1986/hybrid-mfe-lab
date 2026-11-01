import type { ComponentProps, ReactNode } from 'react'
import type { TCardProps } from '../TCard'
import type { TDialogContentProps } from '../TDialog'

// No asChild: the widget renders its own header and body around the content.
export interface TWidgetProps
  extends Omit<ComponentProps<'div'>, 'title' | 'children'>,
    Pick<TCardProps, 'variant' | 'padding'> {
  /** The widget's name: shown in the header by default, and names the expand button and the dialog. */
  title: string
  /** Header content instead of the title (the expand button stays at the end). */
  header?: ReactNode
  /** The content. */
  children?: ReactNode
  /** Header of the expanded view. Defaults to `header`, then the title. */
  expandedHeader?: ReactNode
  /** Content of the expanded view. Defaults to a second render of `children`. */
  expandedContent?: ReactNode
  /** Controlled expanded state; pair it with onExpandedChange. */
  expanded?: boolean
  /** Initial expanded state when uncontrolled. */
  defaultExpanded?: boolean
  /** Called when the expanded view opens or closes. */
  onExpandedChange?: (expanded: boolean) => void
  /** Size of the expanded view (a TDialogContent size). */
  expandedSize?: TDialogContentProps['size']
  /** The expand button's accessible name is this, followed by the title. */
  expandLabel?: string
  /** The default heading element, h2–h6. It doesn't change the heading's size. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}
