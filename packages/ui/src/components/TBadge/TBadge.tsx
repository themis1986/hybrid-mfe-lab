import { cn } from '../../lib/cn'
import { tBadgeVariants } from './TBadge.variants'
import type { TBadgeProps } from './types'

// A short status or category label. The tone only reinforces the text, so the text must say it all.
export function TBadge({
  tone,
  size,
  label,
  className,
  children,
  ...props
}: TBadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(tBadgeVariants({ tone, size }), className)}
      {...props}
    >
      {children ?? label}
    </span>
  )
}
