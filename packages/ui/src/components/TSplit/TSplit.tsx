import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { withStyle } from '../../lib/layout'
import { tSplitVariants } from './TSplit.variants'
import type { TSplitProps } from './types'

export function TSplit({ ratio, minPaneWidth, gap, asChild = false, className, style, ...props }: TSplitProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(tSplitVariants({ ratio, gap }), className)}
      style={withStyle(style, { '--t-split-min': minPaneWidth })}
      {...props}
    />
  )
}
