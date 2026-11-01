import * as Popover from '@radix-ui/react-popover'
import { Slot } from '@radix-ui/react-slot'
import { X } from 'lucide-react'
import { type CSSProperties, useId } from 'react'
import { cn } from '../../lib/cn'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tPopoverCloseClasses,
  tPopoverContentVariants,
  tPopoverDescriptionClasses,
  tPopoverFooterClasses,
  tPopoverHeaderClasses,
  tPopoverTitleClasses,
} from './TPopover.variants'
import type {
  TPopoverCloseProps,
  TPopoverContentProps,
  TPopoverFooterProps,
  TPopoverProps,
  TPopoverTriggerProps,
} from './types'

const contentStyle = {
  '--t-popover-available-height':
    'var(--radix-popover-content-available-height)',
  '--t-popover-transform-origin':
    'var(--radix-popover-content-transform-origin)',
} as CSSProperties

// A panel that opens from a trigger and holds any content: a few related fields, filters, a short form
// (Radix Popover): `open` + `onOpenChange`, or `defaultOpen`. It is non-modal unless `modal`. Fields inside
// may open their own overlays (a TSelect's list): those count as inside, so they don't close it.
export function TPopover(props: TPopoverProps) {
  return <Popover.Root {...props} />
}

// Wraps the button that opens it: <TPopoverTrigger asChild><TButton … /></TPopoverTrigger>.
export function TPopoverTrigger(props: TPopoverTriggerProps) {
  return <Popover.Trigger data-slot="popover-trigger" {...props} />
}

export function TPopoverClose(props: TPopoverCloseProps) {
  return <Popover.Close data-slot="popover-close" {...props} />
}

// The close button comes last, so opening focuses the first field of the content instead.
export function TPopoverContent({
  size,
  title,
  description,
  hideClose = false,
  closeLabel = 'Close',
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  collisionPadding = 8,
  className,
  style,
  children,
  ...props
}: TPopoverContentProps) {
  const id = useId()
  const titleId = title ? `${id}-title` : undefined
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <Popover.Portal>
      <Popover.Content
        data-slot="popover-content"
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(tPopoverContentVariants({ size }), className)}
        style={{ ...contentStyle, ...style }}
        {...props}
      >
        {(title || description) && (
          <div data-slot="popover-header" className={tPopoverHeaderClasses}>
            {title && (
              <h2 id={titleId} className={tPopoverTitleClasses}>
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className={tPopoverDescriptionClasses}>
                {description}
              </p>
            )}
          </div>
        )}
        {children}
        {!hideClose && (
          <Popover.Close asChild>
            <TButton
              variant="ghost"
              size="sm"
              aria-label={closeLabel}
              className={tPopoverCloseClasses}
            >
              <TIcon icon={X} size="sm" />
            </TButton>
          </Popover.Close>
        )}
      </Popover.Content>
    </Popover.Portal>
  )
}

export function TPopoverFooter({
  asChild = false,
  className,
  ...props
}: TPopoverFooterProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="popover-footer"
      className={cn(tPopoverFooterClasses, className)}
      {...props}
    />
  )
}
