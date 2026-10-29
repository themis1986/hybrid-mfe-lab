import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tInputVariants } from './TInput.variants'

export interface TInputProps extends Omit<ComponentProps<'input'>, 'size'>, VariantProps<typeof tInputVariants> {
  /** Marks the input as invalid (`aria-invalid` + error border). */
  invalid?: boolean
}
