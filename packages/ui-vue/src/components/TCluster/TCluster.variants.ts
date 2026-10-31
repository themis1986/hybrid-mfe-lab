import { cva } from 'class-variance-authority'
import { alignVariants, gapVariants, justifyVariants } from '../../lib/layout'

// For content-sized items (tags, chips, button groups): wraps by default, with a tighter gap than an inline row.
export const tClusterVariants = cva('box-border flex flex-wrap', {
  variants: { gap: gapVariants, align: alignVariants, justify: justifyVariants },
  defaultVariants: { gap: 2, align: 'center', justify: 'start' },
})
