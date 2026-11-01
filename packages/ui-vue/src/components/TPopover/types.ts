import type { PrimitiveProps } from 'reka-ui'

export interface TPopoverProps {
  /** Open when first rendered, when no v-model:open is bound. */
  defaultOpen?: boolean
  /** Traps focus and blocks the page behind it. */
  modal?: boolean
}

export interface TPopoverTriggerProps extends PrimitiveProps {}
export interface TPopoverCloseProps extends PrimitiveProps {}

export interface TPopoverContentProps {
  /** Width: 16, 20 or 26rem (at most the viewport minus 2rem). */
  size?: 'sm' | 'md' | 'lg'
  /** A heading at the top that names the popover (aria-labelledby). Without it, pass aria-label. */
  title?: string
  /** A muted line under the title (aria-describedby). */
  description?: string
  /** Leave out the close button (top end corner). Escape and a click outside still close. */
  hideClose?: boolean
  /** Accessible name of the close button. */
  closeLabel?: string
  /** Preferred side; it flips when there isn't room. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Alignment along that side. */
  align?: 'start' | 'center' | 'end'
  /** Gap to the trigger, in px. */
  sideOffset?: number
}

export interface TPopoverFooterProps extends PrimitiveProps {}
