import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '../../lib/cn'
import {
  tTabsClasses,
  tTabsContentClasses,
  tTabsListVariants,
  tTabsTriggerClasses,
} from './TTabs.variants'
import type {
  TTabsContentProps,
  TTabsListProps,
  TTabsProps,
  TTabsTriggerProps,
} from './types'

// Tabbed panels (Radix Tabs): `value` + `onValueChange`, or `defaultValue`. Each TTabsTrigger and
// TTabsContent pair shares a `value`. Arrow keys move between the tabs, and a focused tab is selected.
export function TTabs({ className, ...props }: TTabsProps) {
  return (
    <Tabs.Root
      data-slot="tabs"
      className={cn(tTabsClasses, className)}
      {...props}
    />
  )
}

// `variant` styles the triggers: an underline (line) or raised chips (pills).
export function TTabsList({ variant, className, ...props }: TTabsListProps) {
  return (
    <Tabs.List
      data-slot="tabs-list"
      className={cn(tTabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

export function TTabsTrigger({ className, ...props }: TTabsTriggerProps) {
  return (
    <Tabs.Trigger
      data-slot="tabs-trigger"
      className={cn(tTabsTriggerClasses, className)}
      {...props}
    />
  )
}

export function TTabsContent({ className, ...props }: TTabsContentProps) {
  return (
    <Tabs.Content
      data-slot="tabs-content"
      className={cn(tTabsContentClasses, className)}
      {...props}
    />
  )
}
