import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tContainerVariants } from './TContainer.variants'
import type { TContainerProps } from './types'

export function TContainer({ size, asChild = false, className, ...props }: TContainerProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tContainerVariants({ size }), className)} {...props} />
}
