import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import {
  tAppShellFooterClasses,
  tAppShellHeaderClasses,
  tAppShellMainClasses,
  tAppShellSidebarClasses,
  tAppShellVariants,
} from './TAppShell.variants'
import type {
  TAppShellFooterProps,
  TAppShellHeaderProps,
  TAppShellMainProps,
  TAppShellProps,
  TAppShellSidebarProps,
} from './types'

export function TAppShell({ collapsed, hasSidebar, viewport, asChild = false, className, ...props }: TAppShellProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tAppShellVariants({ collapsed, hasSidebar, viewport }), className)} {...props} />
}

// The root finds the header by its data-slot, to offset the sticky sidebar.
export function TAppShellHeader({ asChild = false, className, ...props }: TAppShellHeaderProps) {
  const Comp = asChild ? Slot : 'header'

  return <Comp data-slot="app-shell-header" className={cn(tAppShellHeaderClasses, className)} {...props} />
}

export function TAppShellSidebar({ asChild = false, className, ...props }: TAppShellSidebarProps) {
  const Comp = asChild ? Slot : 'aside'

  return <Comp data-slot="app-shell-sidebar" className={cn(tAppShellSidebarClasses, className)} {...props} />
}

export function TAppShellMain({ asChild = false, className, ...props }: TAppShellMainProps) {
  const Comp = asChild ? Slot : 'main'

  return <Comp data-slot="app-shell-main" className={cn(tAppShellMainClasses, className)} {...props} />
}

export function TAppShellFooter({ asChild = false, className, ...props }: TAppShellFooterProps) {
  const Comp = asChild ? Slot : 'footer'

  return <Comp data-slot="app-shell-footer" className={cn(tAppShellFooterClasses, className)} {...props} />
}
