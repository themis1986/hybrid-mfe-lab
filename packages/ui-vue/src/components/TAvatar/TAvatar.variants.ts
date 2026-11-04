import { cva } from 'class-variance-authority'

export const tAvatarVariants = cva(
  'inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent-subtle font-medium text-accent-fg select-none',
  {
    variants: {
      size: {
        sm: 'size-6 text-xs',
        md: 'size-8 text-sm',
        lg: 'size-10 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const tAvatarImageClasses = 'block size-full object-cover'
