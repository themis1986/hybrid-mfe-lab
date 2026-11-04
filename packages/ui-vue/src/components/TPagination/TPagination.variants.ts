import { cva } from 'class-variance-authority'

export const tPaginationClasses = 'font-sans text-sm text-fg'

// There is no Preflight (see styles/index.css), so the list resets the browser's defaults.
export const tPaginationListClasses =
  'm-0 flex list-none flex-wrap items-center gap-1 p-0'

export const tPaginationListItemClasses = 'flex'

// Only what the buttons add to TButton: square at one or two digits, growing with longer numbers.
export const tPaginationButtonVariants = cva('tabular-nums', {
  variants: {
    size: {
      sm: 'min-w-8 px-1.5',
      md: 'min-w-9 px-2',
      lg: 'min-w-11 px-2.5',
    },
  },
  defaultVariants: { size: 'md' },
})

export const tPaginationEllipsisVariants = cva(
  'inline-flex items-center justify-center text-fg-muted select-none',
  {
    variants: {
      size: {
        sm: 'h-8 min-w-8 text-sm',
        md: 'h-9 min-w-9 text-sm',
        lg: 'h-11 min-w-11 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)
