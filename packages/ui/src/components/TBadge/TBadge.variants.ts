import { cva } from 'class-variance-authority'

export const tBadgeVariants = cva(
  'inline-flex max-w-full min-w-0 items-center gap-1 rounded-sm font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-surface text-fg-muted',
        accent: 'bg-accent-subtle text-accent-fg',
        success: 'bg-success-subtle text-success-fg',
        info: 'bg-info-subtle text-info-fg',
        warning: 'bg-warning-subtle text-warning-fg',
        danger: 'bg-danger-subtle text-danger-fg',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs leading-4',
        md: 'px-2 py-0.5 text-sm leading-5',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'sm' },
  },
)
