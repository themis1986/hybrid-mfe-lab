import * as Checkbox from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { TIcon } from '../TIcon'
import {
  tCheckboxIconClasses,
  tCheckboxIndeterminateIconClasses,
  tCheckboxIndicatorClasses,
  tCheckboxVariants,
} from './TCheckbox.variants'
import type { TCheckboxProps } from './types'

// A checkbox (Radix Checkbox): `checked` (true, false or 'indeterminate') + `onCheckedChange`, or
// `defaultChecked` uncontrolled. Name it with `aria-label` or a <label htmlFor>.
export function TCheckbox({ size, className, ...props }: TCheckboxProps) {
  return (
    <Checkbox.Root data-slot="checkbox" className={cn(tCheckboxVariants({ size }), className)} {...props}>
      <Checkbox.Indicator data-slot="checkbox-indicator" className={tCheckboxIndicatorClasses}>
        <TIcon icon={Check} className={tCheckboxIconClasses} />
        <TIcon icon={Minus} className={tCheckboxIndeterminateIconClasses} />
      </Checkbox.Indicator>
    </Checkbox.Root>
  )
}
