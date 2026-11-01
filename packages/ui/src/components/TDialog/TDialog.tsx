import * as Dialog from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tDialogBodyClasses,
  tDialogCloseClasses,
  tDialogContentVariants,
  tDialogDescriptionClasses,
  tDialogFooterClasses,
  tDialogHeaderClasses,
  tDialogOverlayClasses,
  tDialogTitleClasses,
} from './TDialog.variants'
import type {
  TDialogBodyProps,
  TDialogCloseProps,
  TDialogContentProps,
  TDialogDescriptionProps,
  TDialogFooterProps,
  TDialogHeaderProps,
  TDialogProps,
  TDialogTitleProps,
  TDialogTriggerProps,
} from './types'

// A modal dialog (Radix Dialog): `open` + `onOpenChange`, or `defaultOpen` uncontrolled. Give every
// dialog a TDialogTitle: it names the dialog for assistive technology.
export function TDialog(props: TDialogProps) {
  return <Dialog.Root {...props} />
}

export function TDialogTrigger(props: TDialogTriggerProps) {
  return <Dialog.Trigger {...props} />
}

export function TDialogClose(props: TDialogCloseProps) {
  return <Dialog.Close {...props} />
}

// The close button comes last, so opening focuses the first control of the content instead.
export function TDialogContent({
  size,
  hideClose = false,
  closeLabel = 'Close',
  className,
  children,
  ...props
}: TDialogContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        data-slot="dialog-overlay"
        className={tDialogOverlayClasses}
      />
      <Dialog.Content
        data-slot="dialog-content"
        className={cn(tDialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {!hideClose && (
          <Dialog.Close asChild>
            <TButton
              variant="ghost"
              size="sm"
              aria-label={closeLabel}
              className={tDialogCloseClasses}
            >
              <TIcon icon={X} size="sm" />
            </TButton>
          </Dialog.Close>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export function TDialogHeader({
  asChild = false,
  className,
  ...props
}: TDialogHeaderProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tDialogHeaderClasses, className)} {...props} />
}

export function TDialogTitle({ className, ...props }: TDialogTitleProps) {
  return (
    <Dialog.Title className={cn(tDialogTitleClasses, className)} {...props} />
  )
}

export function TDialogDescription({
  className,
  ...props
}: TDialogDescriptionProps) {
  return (
    <Dialog.Description
      className={cn(tDialogDescriptionClasses, className)}
      {...props}
    />
  )
}

export function TDialogBody({
  asChild = false,
  className,
  ...props
}: TDialogBodyProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tDialogBodyClasses, className)} {...props} />
}

export function TDialogFooter({
  asChild = false,
  className,
  ...props
}: TDialogFooterProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tDialogFooterClasses, className)} {...props} />
}
