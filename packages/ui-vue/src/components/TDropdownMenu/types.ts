import type { PrimitiveProps } from 'reka-ui'

export interface TDropdownMenuProps {
  /** Open when first rendered, when no v-model:open is bound. */
  defaultOpen?: boolean
  /** Traps focus and blocks the page behind it. */
  modal?: boolean
}

export interface TDropdownMenuTriggerProps extends PrimitiveProps {}

export interface TDropdownMenuContentProps extends PrimitiveProps {
  /** Preferred side; it flips when there isn't room. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Alignment along that side. */
  align?: 'start' | 'center' | 'end'
  /** Gap to the trigger, in px. */
  sideOffset?: number
}

export interface TDropdownMenuItemProps extends PrimitiveProps {
  /** `danger` for a destructive action. */
  tone?: 'neutral' | 'danger'
  disabled?: boolean
}

export interface TDropdownMenuGroupProps extends PrimitiveProps {}
export interface TDropdownMenuLabelProps extends PrimitiveProps {}
export interface TDropdownMenuSeparatorProps extends PrimitiveProps {}
