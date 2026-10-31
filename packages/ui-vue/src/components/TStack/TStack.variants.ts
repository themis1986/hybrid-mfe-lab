import { cva } from 'class-variance-authority'
import { alignVariants, gapVariants, justifyVariants } from '../../lib/layout'

export const tStackVariants = cva('box-border flex flex-col', {
  variants: { gap: gapVariants, align: alignVariants, justify: justifyVariants },
  defaultVariants: { gap: 3, align: 'stretch' },
})
