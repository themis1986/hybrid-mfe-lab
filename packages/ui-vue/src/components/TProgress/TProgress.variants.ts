import { cva } from 'class-variance-authority'

export const tProgressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-line',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// The indicator is full width, translated left by the part not yet done (an inline translate). Without a
// value (data-state="indeterminate", from Radix and Reka) it is a third-width bar sliding across; with
// reduced motion, a still, half-transparent full bar.
export const tProgressIndicatorVariants = cva(
  [
    'block h-full w-full rounded-full transition-[translate] duration-300 ease-out',
    'data-[state=indeterminate]:w-1/3 data-[state=indeterminate]:animate-progress-indeterminate',
    'motion-reduce:data-[state=indeterminate]:w-full motion-reduce:data-[state=indeterminate]:animate-none',
    'motion-reduce:data-[state=indeterminate]:opacity-50',
  ],
  {
    variants: {
      tone: {
        accent: 'bg-accent',
        success: 'bg-success',
        info: 'bg-info',
        warning: 'bg-warning',
        danger: 'bg-danger',
      },
    },
    defaultVariants: { tone: 'accent' },
  },
)
