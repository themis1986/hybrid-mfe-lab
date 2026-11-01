import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tSpinnerVariants } from './TSpinner.variants'

export interface TSpinnerProps
  extends ComponentProps<'span'>, VariantProps<typeof tSpinnerVariants> {
  /** Announced to assistive technology (visually hidden). */
  label?: string
}
