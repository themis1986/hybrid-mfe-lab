import type * as Collapsible from '@radix-ui/react-collapsible'
import type { ComponentProps } from 'react'

export interface TCollapsibleProps extends ComponentProps<typeof Collapsible.Root> {}
export interface TCollapsibleTriggerProps extends ComponentProps<typeof Collapsible.Trigger> {}
export interface TCollapsibleContentProps extends ComponentProps<typeof Collapsible.Content> {}
