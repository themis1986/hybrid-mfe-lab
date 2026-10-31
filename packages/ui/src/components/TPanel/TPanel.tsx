import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import { tPanelTitleClasses, tPanelVariants } from './TPanel.variants'
import type { TPanelProps } from './types'

export function TPanel({ tone, padding, title, asChild = false, className, children, ...props }: TPanelProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp className={cn(tPanelVariants({ tone, padding }), className)} {...props}>
      {title != null && <p className={tPanelTitleClasses}>{title}</p>}
      <Slottable>{children}</Slottable>
    </Comp>
  )
}
