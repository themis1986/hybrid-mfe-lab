import type * as Switch from '@radix-ui/react-switch'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tSwitchVariants } from './TSwitch.variants'

export interface TSwitchProps extends ComponentProps<typeof Switch.Root>, VariantProps<typeof tSwitchVariants> {}
