import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tInlineVariants } from './TInline.variants'
import type { TInlineProps } from './types'

export function TInline({ gap, align, justify, wrap, asChild = false, className, ...props }: TInlineProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tInlineVariants({ gap, align, justify, wrap }), className)} {...props} />
}
