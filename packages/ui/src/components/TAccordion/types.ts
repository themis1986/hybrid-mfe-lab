import type * as Accordion from '@radix-ui/react-accordion'
import type { ComponentProps } from 'react'

/** `type="single"` (with optional `collapsible`) or `type="multiple"`, as Radix's root. */
export type TAccordionProps = ComponentProps<typeof Accordion.Root>
export interface TAccordionItemProps extends ComponentProps<typeof Accordion.Item> {}
export interface TAccordionTriggerProps extends ComponentProps<typeof Accordion.Trigger> {}
export interface TAccordionContentProps extends ComponentProps<typeof Accordion.Content> {}
