import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { tSkeletonVariants } from './TSkeleton.variants'

export interface TSkeletonProps
  extends ComponentProps<'span'>, VariantProps<typeof tSkeletonVariants> {}
