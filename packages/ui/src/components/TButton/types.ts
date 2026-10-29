import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tButtonVariants } from './TButton.variants'

export interface TButtonProps extends ComponentProps<'button'>, VariantProps<typeof tButtonVariants> {
  /** Text content. Custom elements can only pass text this way (see register.ts). */
  label?: string
  /** Render the single child element instead of a <button>, merging these props onto it (Radix Slot). */
  asChild?: boolean
}
