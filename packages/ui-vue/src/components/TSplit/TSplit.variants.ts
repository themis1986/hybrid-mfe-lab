import { cva } from 'class-variance-authority'
import { gapVariants } from '../../lib/layout'

// Panes grow from a zero basis, so side by side they split the width exactly by their grow ratio. Their
// min width also decides wrapping: below two panes' worth (plus the gap) they stack. min(100%, …) keeps
// a stacked pane from overflowing a container narrower than --t-split-min; the panes are border-box
// (no Preflight) so their own padding stays inside that width.
export const tSplitVariants = cva(
  'box-border flex flex-wrap *:box-border *:min-w-[min(100%,var(--t-split-min,20rem))] *:flex-[1_1_0%]',
  {
    variants: {
      ratio: {
        '1-1': '',
        '1-2': '[&>:last-child]:grow-2',
        '2-1': '[&>:first-child]:grow-2',
      },
      gap: gapVariants,
    },
    defaultVariants: { ratio: '1-1', gap: 3 },
  },
)
