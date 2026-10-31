import { cva } from 'class-variance-authority'
import { alignVariants, gapVariants, justifyVariants } from '../../lib/layout'

export const tInlineVariants = cva('box-border flex flex-row', {
  variants: {
    gap: gapVariants,
    align: alignVariants,
    justify: justifyVariants,
    wrap: { true: 'flex-wrap' },
  },
  defaultVariants: { gap: 3, align: 'center' },
})
