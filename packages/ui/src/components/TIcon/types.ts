import type { VariantProps } from 'class-variance-authority'
import type { LucideIcon, LucideProps } from 'lucide-react'
import type { tIconVariants } from './TIcon.variants'

export interface TIconProps extends Omit<LucideProps, 'size' | 'ref'>, VariantProps<typeof tIconVariants> {
  /** The icon to render, imported from '@repo/ui/icons'. */
  icon: LucideIcon
  /** Accessible name. Without one the icon is decorative and hidden from assistive technology. */
  label?: string
}
