import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tClusterVariants } from './TCluster.variants'
import type { TClusterProps } from './types'

export function TCluster({ gap, align, justify, asChild = false, className, ...props }: TClusterProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tClusterVariants({ gap, align, justify }), className)} {...props} />
}
