import * as RadioGroup from '@radix-ui/react-radio-group'
import { cn } from '../../lib/cn'
import { tRadioGroupVariants, tRadioIndicatorClasses, tRadioVariants } from './TRadioGroup.variants'
import type { TRadioGroupItemProps, TRadioGroupProps } from './types'

// A set of radio buttons (Radix RadioGroup): `value` + `onValueChange`, or `defaultValue` uncontrolled.
// Name the group with `aria-label` or `aria-labelledby`, and each item with a <label>.
export function TRadioGroup({ orientation, className, ...props }: TRadioGroupProps) {
  return (
    <RadioGroup.Root
      data-slot="radio-group"
      orientation={orientation}
      className={cn(tRadioGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

export function TRadioGroupItem({ size, className, ...props }: TRadioGroupItemProps) {
  return (
    <RadioGroup.Item data-slot="radio-group-item" className={cn(tRadioVariants({ size }), className)} {...props}>
      <RadioGroup.Indicator data-slot="radio-group-indicator" className={tRadioIndicatorClasses} />
    </RadioGroup.Item>
  )
}
