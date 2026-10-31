import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tDividerVariants } from './TDivider.variants'
import type { TDividerProps } from './types'

export function TDivider({ orientation, asChild = false, className, ...props }: TDividerProps) {
  const Comp = asChild ? Slot : 'hr'

  // <hr> is a separator by default; a slotted element (e.g. a <div>) needs the role spelled out.
  return (
    <Comp
      role={asChild ? 'separator' : undefined}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(tDividerVariants({ orientation }), className)}
      {...props}
    />
  )
}
