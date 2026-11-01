import type * as Dialog from '@radix-ui/react-dialog'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tDialogContentVariants } from './TDialog.variants'

export type TDialogProps = ComponentProps<typeof Dialog.Root>
export type TDialogTriggerProps = ComponentProps<typeof Dialog.Trigger>
export type TDialogCloseProps = ComponentProps<typeof Dialog.Close>
export type TDialogTitleProps = ComponentProps<typeof Dialog.Title>
export type TDialogDescriptionProps = ComponentProps<typeof Dialog.Description>

// No asChild: the content renders its own close button next to the children.
export interface TDialogContentProps
  extends
    Omit<ComponentProps<typeof Dialog.Content>, 'asChild'>,
    VariantProps<typeof tDialogContentVariants> {
  /** Leave out the close button (top end corner). Escape and a click on the overlay still close. */
  hideClose?: boolean
  /** Accessible name of the close button. */
  closeLabel?: string
}

export interface TDialogPartProps extends ComponentProps<'div'> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}

export type TDialogHeaderProps = TDialogPartProps
export type TDialogBodyProps = TDialogPartProps
export type TDialogFooterProps = TDialogPartProps
