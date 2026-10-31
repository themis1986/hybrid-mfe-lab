import { cva } from 'class-variance-authority'

export const tContainerVariants = cva('mx-auto box-border w-full px-4', {
  variants: {
    size: {
      sm: 'max-w-(--t-container-sm)',
      md: 'max-w-(--t-container-md)',
      lg: 'max-w-(--t-container-lg)',
      full: 'max-w-none',
    },
  },
  defaultVariants: { size: 'lg' },
})
