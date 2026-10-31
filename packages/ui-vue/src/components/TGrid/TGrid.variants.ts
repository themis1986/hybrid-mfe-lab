import { cva } from 'class-variance-authority'
import { gapVariants } from '../../lib/layout'

// `auto` fits as many columns of at least --t-grid-min as the container allows. min(100%, …) lets a
// single column shrink below that width, so a narrow container never overflows.
export const tGridVariants = cva('box-border grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    },
    auto: { true: 'grid-cols-[repeat(auto-fit,minmax(min(100%,var(--t-grid-min,16rem)),1fr))]' },
    gap: gapVariants,
  },
  defaultVariants: { cols: 1, gap: 3 },
})
