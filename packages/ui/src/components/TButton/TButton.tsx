import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tButtonVariants } from './TButton.variants'
import type { TButtonProps } from './types'

export function TButton({ label, children, variant, size, asChild = false, className, type, ...props }: TButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      type={asChild ? type : (type ?? 'button')}
      className={cn(tButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children ?? label}
    </Comp>
  )
}
