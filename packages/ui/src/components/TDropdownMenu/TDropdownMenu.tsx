import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import {
  tDropdownMenuContentClasses,
  tDropdownMenuItemVariants,
  tDropdownMenuLabelClasses,
  tDropdownMenuSeparatorClasses,
} from './TDropdownMenu.variants'
import type {
  TDropdownMenuContentProps,
  TDropdownMenuGroupProps,
  TDropdownMenuItemProps,
  TDropdownMenuLabelProps,
  TDropdownMenuProps,
  TDropdownMenuSeparatorProps,
  TDropdownMenuTriggerProps,
} from './types'

const contentStyle = {
  '--t-dropdown-menu-available-height':
    'var(--radix-dropdown-menu-content-available-height)',
  '--t-dropdown-menu-transform-origin':
    'var(--radix-dropdown-menu-content-transform-origin)',
} as CSSProperties

// A list of actions that opens from a button, with menu roles and arrow-key navigation (Radix Dropdown
// Menu). Non-modal by default: a modal menu blocks the page's pointer events and can leave them blocked
// when an item opens a dialog.
export function TDropdownMenu({ modal = false, ...props }: TDropdownMenuProps) {
  return <DropdownMenu.Root modal={modal} {...props} />
}

// Wraps the button that opens it: <TDropdownMenuTrigger asChild><TButton … /></TDropdownMenuTrigger>.
export function TDropdownMenuTrigger(props: TDropdownMenuTriggerProps) {
  return <DropdownMenu.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

export function TDropdownMenuContent({
  align = 'start',
  sideOffset = 4,
  collisionPadding = 8,
  className,
  style,
  ...props
}: TDropdownMenuContentProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        data-slot="dropdown-menu-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(tDropdownMenuContentClasses, className)}
        style={{ ...contentStyle, ...style }}
        {...props}
      />
    </DropdownMenu.Portal>
  )
}

export function TDropdownMenuItem({
  tone,
  className,
  ...props
}: TDropdownMenuItemProps) {
  return (
    <DropdownMenu.Item
      data-slot="dropdown-menu-item"
      className={cn(tDropdownMenuItemVariants({ tone }), className)}
      {...props}
    />
  )
}

export function TDropdownMenuGroup(props: TDropdownMenuGroupProps) {
  return <DropdownMenu.Group data-slot="dropdown-menu-group" {...props} />
}

export function TDropdownMenuLabel({
  className,
  ...props
}: TDropdownMenuLabelProps) {
  return (
    <DropdownMenu.Label
      data-slot="dropdown-menu-label"
      className={cn(tDropdownMenuLabelClasses, className)}
      {...props}
    />
  )
}

export function TDropdownMenuSeparator({
  className,
  ...props
}: TDropdownMenuSeparatorProps) {
  return (
    <DropdownMenu.Separator
      data-slot="dropdown-menu-separator"
      className={cn(tDropdownMenuSeparatorClasses, className)}
      {...props}
    />
  )
}
