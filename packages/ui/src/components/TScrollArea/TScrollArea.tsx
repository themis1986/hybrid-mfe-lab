import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { withStyle } from '../../lib/layout'
import { tScrollAreaVariants } from './TScrollArea.variants'
import type { TScrollAreaProps } from './types'

// A scrollable region must be reachable by keyboard, so it is focusable by default (a caller's own
// tabIndex wins). Callers should also pass role="region" and an aria-label naming the content.
export function TScrollArea({ orientation, maxHeight, asChild = false, className, style, ...props }: TScrollAreaProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      tabIndex={0}
      className={cn(tScrollAreaVariants({ orientation }), className)}
      style={withStyle(style, { maxHeight })}
      {...props}
    />
  )
}
