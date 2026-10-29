import { cva } from 'class-variance-authority'

// No Preflight: box-border and the margin reset are ours to set, or `w-full` + padding overflows.
export const tInputVariants = cva(
  [
    'm-0 box-border block w-full rounded-md border border-line-strong bg-canvas font-sans text-fg shadow-sm',
    'placeholder:text-fg-muted transition-colors duration-150 ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-3 text-sm',
        lg: 'h-11 px-4 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)
