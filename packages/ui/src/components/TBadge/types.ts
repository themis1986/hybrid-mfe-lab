import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tBadgeVariants } from './TBadge.variants'

export interface TBadgeProps
  extends ComponentProps<'span'>, VariantProps<typeof tBadgeVariants> {
  /** Text content, when there are no children. */
  label?: string
}
