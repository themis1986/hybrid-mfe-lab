import * as Collapsible from '@radix-ui/react-collapsible'
import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import { tCollapsibleContentClasses } from './TCollapsible.variants'
import type {
  TCollapsibleContentProps,
  TCollapsibleProps,
  TCollapsibleTriggerProps,
} from './types'

const contentStyle = {
  '--t-collapsible-height': 'var(--radix-collapsible-content-height)',
} as CSSProperties

// A section that shows and hides its content (Radix Collapsible): `open` + `onOpenChange`, or
// `defaultOpen`. The root and the trigger carry no styles: put a TButton in the trigger with `asChild`.
export function TCollapsible(props: TCollapsibleProps) {
  return <Collapsible.Root data-slot="collapsible" {...props} />
}

export function TCollapsibleTrigger(props: TCollapsibleTriggerProps) {
  return <Collapsible.Trigger data-slot="collapsible-trigger" {...props} />
}

export function TCollapsibleContent({
  className,
  style,
  ...props
}: TCollapsibleContentProps) {
  return (
    <Collapsible.Content
      data-slot="collapsible-content"
      className={cn(tCollapsibleContentClasses, className)}
      style={{ ...contentStyle, ...style }}
      {...props}
    />
  )
}
