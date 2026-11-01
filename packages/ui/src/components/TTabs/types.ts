import type * as Tabs from '@radix-ui/react-tabs'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tTabsListVariants } from './TTabs.variants'

export interface TTabsProps extends ComponentProps<typeof Tabs.Root> {}
export interface TTabsListProps extends ComponentProps<typeof Tabs.List>, VariantProps<typeof tTabsListVariants> {}
export interface TTabsTriggerProps extends ComponentProps<typeof Tabs.Trigger> {}
export interface TTabsContentProps extends ComponentProps<typeof Tabs.Content> {}
