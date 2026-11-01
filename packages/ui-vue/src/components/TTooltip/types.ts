export interface TTooltipProps {
  /** The tooltip's text. The `content` slot replaces it for rich content. */
  content?: string
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
  /** Initial open state when no v-model:open is bound. */
  defaultOpen?: boolean
}
