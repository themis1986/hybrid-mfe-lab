import type * as RadioGroup from '@radix-ui/react-radio-group'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tRadioVariants } from './TRadioGroup.variants'

/** `orientation` sets the layout as well as the arrow keys (vertical by default). */
export interface TRadioGroupProps extends ComponentProps<typeof RadioGroup.Root> {}

export interface TRadioGroupItemProps
  extends ComponentProps<typeof RadioGroup.Item>,
    VariantProps<typeof tRadioVariants> {}
