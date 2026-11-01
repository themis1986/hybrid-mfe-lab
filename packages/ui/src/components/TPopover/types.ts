import type * as Popover from '@radix-ui/react-popover'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import type { tPopoverContentVariants } from './TPopover.variants'

export type TPopoverProps = ComponentProps<typeof Popover.Root>
export type TPopoverTriggerProps = ComponentProps<typeof Popover.Trigger>
export type TPopoverCloseProps = ComponentProps<typeof Popover.Close>

// No asChild: the content renders its own header and close button around the children.
export interface TPopoverContentProps
  extends Omit<ComponentProps<typeof Popover.Content>, 'asChild' | 'title'>,
    VariantProps<typeof tPopoverContentVariants> {
  /** A heading at the top that names the popover (aria-labelledby). Without it, pass aria-label. */
  title?: ReactNode
  /** A muted line under the title (aria-describedby). */
  description?: ReactNode
  /** Leave out the close button (top end corner). Escape and a click outside still close. */
  hideClose?: boolean
  /** Accessible name of the close button. */
  closeLabel?: string
}

export interface TPopoverFooterProps extends ComponentProps<'div'> {
  /** Render the single child element instead of a <div>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
