import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tCardBodyClasses, tCardFooterClasses, tCardHeaderClasses, tCardVariants } from './TCard.variants'
import type { TCardBodyProps, TCardFooterProps, TCardHeaderProps, TCardProps } from './types'

export function TCard({ variant, padding, dividers, asChild = false, className, ...props }: TCardProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cn(tCardVariants({ variant, padding, dividers }), className)} {...props} />
}

export function TCardHeader({ asChild = false, className, ...props }: TCardHeaderProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp data-slot="card-header" className={cn(tCardHeaderClasses, className)} {...props} />
}

export function TCardBody({ asChild = false, className, ...props }: TCardBodyProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp data-slot="card-body" className={cn(tCardBodyClasses, className)} {...props} />
}

export function TCardFooter({ asChild = false, className, ...props }: TCardFooterProps) {
  const Comp = asChild ? Slot : 'div'

  return <Comp data-slot="card-footer" className={cn(tCardFooterClasses, className)} {...props} />
}
