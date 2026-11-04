import { cn } from '../../lib/cn'
import { tSkeletonVariants } from './TSkeleton.variants'
import type { TSkeletonProps } from './types'

// A placeholder for content that is loading. It is decorative: announce the loading state elsewhere.
export function TSkeleton({ shape, className, ...props }: TSkeletonProps) {
  return (
    <span
      aria-hidden
      data-slot="skeleton"
      className={cn(tSkeletonVariants({ shape }), className)}
      {...props}
    />
  )
}
