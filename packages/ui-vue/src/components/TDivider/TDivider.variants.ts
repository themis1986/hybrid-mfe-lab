import { cva } from 'class-variance-authority'

// No Preflight: an <hr> keeps its UA margin and inset border unless reset here. The line is a
// background, so it has the same 1px weight in both orientations.
export const tDividerVariants = cva('m-0 box-border shrink-0 self-stretch border-0 bg-line p-0', {
  variants: {
    orientation: {
      horizontal: 'h-px',
      vertical: 'h-auto min-h-4 w-px',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})
