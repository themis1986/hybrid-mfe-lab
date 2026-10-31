import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tSpacerClasses } from './TSpacer.variants'
import type { TSpacerProps } from './types'

export function TSpacer({ asChild = false, className, ...props }: TSpacerProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tSpacerClasses, className)} {...props} />
}
