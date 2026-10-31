import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { withStyle } from '../../lib/layout'
import { tGridVariants } from './TGrid.variants'
import type { TGridProps } from './types'

export function TGrid({ cols, minChildWidth, gap, asChild = false, className, style, ...props }: TGridProps) {
  const Comp = asChild ? Slot : 'div'
  const auto = minChildWidth !== undefined

  return (
    <Comp
      className={cn(tGridVariants({ cols: auto ? null : cols, auto, gap }), className)}
      style={withStyle(style, { '--t-grid-min': minChildWidth })}
      {...props}
    />
  )
}
