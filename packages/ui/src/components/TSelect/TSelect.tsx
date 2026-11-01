import * as Select from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'
import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import { TIcon } from '../TIcon'
import { tInputVariants } from '../TInput/TInput.variants'
import { tRadioIndicatorClasses, tRadioVariants } from '../TRadioGroup/TRadioGroup.variants'
import { TSelectMultiple } from './TSelectMultiple'
import {
  tSelectChevronClasses,
  tSelectContentClasses,
  tSelectIndicatorClasses,
  tSelectItemClasses,
  tSelectTriggerClasses,
  tSelectValueClasses,
  tSelectViewportClasses,
} from './TSelect.variants'
import type { TSelectProps, TSelectSingleProps } from './types'

// A select over `options`: one value (Radix Select), or several with `multiple`. Radix Select has no
// multiple mode, so that one is built on Radix Popover (TSelectMultiple). Each option shows the
// design system's radio (single) or checkbox (multiple) as a decorative indicator. Name it with
// `aria-label` or a <label htmlFor> pointing at `id`.
export function TSelect(props: TSelectProps) {
  return props.multiple ? <TSelectMultiple {...props} /> : <TSelectSingle {...props} />
}

const contentStyle = {
  '--t-select-trigger-width': 'var(--radix-select-trigger-width)',
  '--t-select-available-height': 'var(--radix-select-content-available-height)',
} as CSSProperties

function TSelectSingle({
  options,
  placeholder,
  size,
  invalid,
  id,
  className,
  multiple: _multiple,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  ...rootProps
}: TSelectSingleProps) {
  return (
    <Select.Root {...rootProps}>
      <Select.Trigger
        data-slot="select-trigger"
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={invalid || undefined}
        className={cn(tInputVariants({ size }), tSelectTriggerClasses, className)}
      >
        <Select.Value placeholder={placeholder} className={tSelectValueClasses} />
        <TIcon icon={ChevronDown} className={tSelectChevronClasses} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          data-slot="select-content"
          position="popper"
          side="bottom"
          align="start"
          sideOffset={4}
          className={tSelectContentClasses}
          style={contentStyle}
        >
          <Select.Viewport className={tSelectViewportClasses}>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                data-slot="select-item"
                value={option.value}
                disabled={option.disabled}
                className={tSelectItemClasses}
              >
                <span aria-hidden className={cn(tRadioVariants({ size: 'sm' }), tSelectIndicatorClasses)}>
                  <Select.ItemIndicator className={tRadioIndicatorClasses} />
                </span>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
