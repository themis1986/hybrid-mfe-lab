import { cva } from 'class-variance-authority'

// Native overflow, so there is no scroll state in the library. overscroll-contain stops a scroll that
// reaches the end from scrolling the page behind it.
export const tScrollAreaVariants = cva(
  [
    'box-border overscroll-contain [scrollbar-color:var(--t-color-line-strong)_transparent] [scrollbar-width:thin]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  ],
  {
    variants: {
      orientation: {
        vertical: 'overflow-x-hidden overflow-y-auto',
        horizontal: 'overflow-x-auto overflow-y-hidden',
        both: 'overflow-auto',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  },
)
