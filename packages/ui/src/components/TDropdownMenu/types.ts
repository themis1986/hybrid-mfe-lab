import type * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tDropdownMenuItemVariants } from './TDropdownMenu.variants'

export type TDropdownMenuProps = ComponentProps<typeof DropdownMenu.Root>
export type TDropdownMenuTriggerProps = ComponentProps<
  typeof DropdownMenu.Trigger
>
export type TDropdownMenuContentProps = ComponentProps<
  typeof DropdownMenu.Content
>
export type TDropdownMenuGroupProps = ComponentProps<typeof DropdownMenu.Group>
export type TDropdownMenuLabelProps = ComponentProps<typeof DropdownMenu.Label>
export type TDropdownMenuSeparatorProps = ComponentProps<
  typeof DropdownMenu.Separator
>

export interface TDropdownMenuItemProps
  extends
    ComponentProps<typeof DropdownMenu.Item>,
    VariantProps<typeof tDropdownMenuItemVariants> {}
