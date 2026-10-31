import { cn } from '../../lib/cn'
import { tIconVariants } from './TIcon.variants'
import type { TIconProps } from './types'

export function TIcon({ icon: Icon, size, label, className, ...props }: TIconProps) {
  return (
    <Icon
      data-slot="icon"
      // Lucide hides an icon (aria-hidden) unless it receives an accessibility attribute.
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={cn(tIconVariants({ size }), className)}
      {...props}
    />
  )
}
