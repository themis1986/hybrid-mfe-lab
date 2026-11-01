import type { PrimitiveProps } from 'reka-ui'

export interface TDialogProps {
  /** Initial state when no v-model:open is bound. */
  defaultOpen?: boolean
  /** Makes the rest of the page inert while open (default true). */
  modal?: boolean
}

export interface TDialogTriggerProps extends PrimitiveProps {}
export interface TDialogCloseProps extends PrimitiveProps {}

// `as` only: the content renders its own close button next to the slot.
export interface TDialogContentProps {
  /** Maximum width, or `full` to fill the viewport. */
  size?: 'sm' | 'md' | 'lg' | 'full'
  /** Leave out the close button (top end corner). Escape and a click on the overlay still close. */
  hideClose?: boolean
  /** Accessible name of the close button. */
  closeLabel?: string
  /** The element or component to render. */
  as?: PrimitiveProps['as']
}

export interface TDialogHeaderProps extends PrimitiveProps {}
export interface TDialogTitleProps extends PrimitiveProps {}
export interface TDialogDescriptionProps extends PrimitiveProps {}
export interface TDialogBodyProps extends PrimitiveProps {}
export interface TDialogFooterProps extends PrimitiveProps {}
