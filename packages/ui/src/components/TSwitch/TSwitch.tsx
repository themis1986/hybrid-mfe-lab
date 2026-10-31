import * as Switch from '@radix-ui/react-switch'
import { cn } from '../../lib/cn'
import { tSwitchThumbVariants, tSwitchVariants } from './TSwitch.variants'
import type { TSwitchProps } from './types'

// An on/off toggle (Radix Switch): `checked` + `onCheckedChange`, or `defaultChecked` uncontrolled.
// Name it with `aria-label` or a <label htmlFor>.
export function TSwitch({ size, className, ...props }: TSwitchProps) {
  return (
    <Switch.Root data-slot="switch" className={cn(tSwitchVariants({ size }), className)} {...props}>
      <Switch.Thumb data-slot="switch-thumb" className={tSwitchThumbVariants({ size })} />
    </Switch.Root>
  )
}
