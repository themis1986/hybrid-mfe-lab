import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tAvatarVariants } from './TAvatar.variants'

export interface TAvatarProps
  extends
    Omit<ComponentProps<'span'>, 'children'>,
    VariantProps<typeof tAvatarVariants> {
  /** The person or thing shown: the accessible name, and the initials without an image. */
  name: string
  src?: string
}
