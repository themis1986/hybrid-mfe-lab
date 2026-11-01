import type * as Tooltip from '@radix-ui/react-tooltip'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

export interface TTooltipProps extends Omit<ComponentProps<typeof Tooltip.Content>, 'content' | 'children'> {
  /** The tooltip's content. */
  content: ReactNode
  /** The trigger: one focusable element that accepts a ref (a native element, or a component that spreads its props). */
  children: ReactElement
  /** Preferred side; it flips when there isn't room. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Alignment along that side. */
  align?: 'start' | 'center' | 'end'
  /** Gap to the trigger, in px. */
  sideOffset?: number
  /** Hover delay before opening, in ms. Keyboard focus opens it at once. */
  delayDuration?: number
  /** Shows the pointer towards the trigger. */
  arrow?: boolean
  /** Renders only the trigger. */
  disabled?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}
