import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { withStyle } from '../../lib/layout'
import { tAspectRatioVariants } from './TAspectRatio.variants'
import type { TAspectRatioProps } from './types'

export function TAspectRatio({ ratio, asChild = false, className, style, ...props }: TAspectRatioProps) {
  const Comp = asChild ? Slot : 'div'
  const custom = typeof ratio === 'number'

  return (
    <Comp
      className={cn(tAspectRatioVariants({ ratio: custom ? null : ratio }), className)}
      style={withStyle(style, { aspectRatio: custom ? ratio : undefined })}
      {...props}
    />
  )
}
