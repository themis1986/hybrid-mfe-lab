import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tStackVariants } from './TStack.variants'
import type { TStackProps } from './types'

export function TStack({ gap, align, justify, asChild = false, className, ...props }: TStackProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tStackVariants({ gap, align, justify }), className)} {...props} />
}
