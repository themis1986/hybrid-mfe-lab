import { cva } from 'class-variance-authority'

// A placeholder for content that is loading. Size it through the caller's classes.
export const tSkeletonVariants = cva(
  'block bg-line animate-pulse motion-reduce:animate-none',
  {
    variants: {
      shape: {
        text: 'h-3 w-full rounded-sm',
        block: 'h-full w-full rounded-md',
        circle: 'size-8 rounded-full',
      },
    },
    defaultVariants: { shape: 'text' },
  },
)
