import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import { tCollapsibleContentClasses } from '../TCollapsible/TCollapsible.variants'
import { TIcon } from '../TIcon'
import {
  tAccordionChevronClasses,
  tAccordionContentInnerClasses,
  tAccordionHeaderClasses,
  tAccordionItemClasses,
  tAccordionTriggerClasses,
} from './TAccordion.variants'
import type {
  TAccordionContentProps,
  TAccordionItemProps,
  TAccordionProps,
  TAccordionTriggerProps,
} from './types'

const contentStyle = {
  '--t-collapsible-height': 'var(--radix-accordion-content-height)',
} as CSSProperties

// Stacked sections that open one at a time (`type="single"`, `collapsible` to allow closing the open
// one) or several at once (`type="multiple"`) (Radix Accordion). Each TAccordionItem has a `value`.
export function TAccordion({ className, ...props }: TAccordionProps) {
  return (
    <Accordion.Root data-slot="accordion" className={className} {...props} />
  )
}

export function TAccordionItem({ className, ...props }: TAccordionItemProps) {
  return (
    <Accordion.Item
      data-slot="accordion-item"
      className={cn(tAccordionItemClasses, className)}
      {...props}
    />
  )
}

// The trigger sits in the item's heading (an <h3>), followed by a chevron that turns when open.
export function TAccordionTrigger({
  className,
  children,
  ...props
}: TAccordionTriggerProps) {
  return (
    <Accordion.Header className={tAccordionHeaderClasses}>
      <Accordion.Trigger
        data-slot="accordion-trigger"
        className={cn(tAccordionTriggerClasses, className)}
        {...props}
      >
        {children}
        <TIcon icon={ChevronDown} className={tAccordionChevronClasses} />
      </Accordion.Trigger>
    </Accordion.Header>
  )
}

// Animates its height like TCollapsibleContent; the padding sits on an inner wrapper.
export function TAccordionContent({
  className,
  style,
  children,
  ...props
}: TAccordionContentProps) {
  return (
    <Accordion.Content
      data-slot="accordion-content"
      className={tCollapsibleContentClasses}
      style={{ ...contentStyle, ...style }}
      {...props}
    >
      <div className={cn(tAccordionContentInnerClasses, className)}>
        {children}
      </div>
    </Accordion.Content>
  )
}
