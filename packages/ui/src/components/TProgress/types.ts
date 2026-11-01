import type * as Progress from '@radix-ui/react-progress'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tProgressIndicatorVariants, tProgressVariants } from './TProgress.variants'

export interface TProgressProps
  extends ComponentProps<typeof Progress.Root>,
    VariantProps<typeof tProgressVariants>,
    VariantProps<typeof tProgressIndicatorVariants> {}
