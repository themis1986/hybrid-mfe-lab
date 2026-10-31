import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { withStyle } from '../../lib/layout'
import {
  tSidebarLayoutContentClasses,
  tSidebarLayoutSidebarClasses,
  tSidebarLayoutVariants,
} from './TSidebarLayout.variants'
import type { TSidebarLayoutContentProps, TSidebarLayoutProps, TSidebarLayoutSidebarProps } from './types'

export function TSidebarLayout({
  side,
  sidebarWidth,
  collapsed,
  gap,
  asChild = false,
  className,
  style,
  ...props
}: TSidebarLayoutProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(tSidebarLayoutVariants({ side, collapsed, gap }), className)}
      style={withStyle(style, { '--t-sidebar-width': sidebarWidth })}
      {...props}
    />
  )
}

export function TSidebarLayoutSidebar({ asChild = false, className, ...props }: TSidebarLayoutSidebarProps) {
  const Comp = asChild ? Slot : 'aside'

  return <Comp data-slot="sidebar-layout-sidebar" className={cn(tSidebarLayoutSidebarClasses, className)} {...props} />
}

export function TSidebarLayoutContent({ asChild = false, className, ...props }: TSidebarLayoutContentProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp data-slot="sidebar-layout-content" className={cn(tSidebarLayoutContentClasses, className)} {...props} />
}
