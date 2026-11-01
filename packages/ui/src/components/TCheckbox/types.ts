import type * as Checkbox from '@radix-ui/react-checkbox'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tCheckboxVariants } from './TCheckbox.variants'

export interface TCheckboxProps extends ComponentProps<typeof Checkbox.Root>, VariantProps<typeof tCheckboxVariants> {}
