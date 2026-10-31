import { cva } from 'class-variance-authority'

// Padding model: one value, --t-card-pad (set by `padding`), is the card's padding, the gap between
// its parts, and the space between the header/footer divider and their content. The header and footer
// stretch their divider to the card's edges with a negative margin, so the parts never add padding of
// their own on top. Change the padding through the `padding` prop, not a `p-*` class, or the parts drift.
export const tCardVariants = cva(
  'box-border flex flex-col gap-(--t-card-pad) rounded-lg border border-line p-(--t-card-pad) text-fg',
  {
    variants: {
      variant: {
        outline: 'bg-transparent',
        filled: 'bg-surface',
        elevated: 'bg-canvas shadow-sm',
      },
      padding: {
        0: '[--t-card-pad:--spacing(0)]',
        1: '[--t-card-pad:--spacing(1)]',
        2: '[--t-card-pad:--spacing(2)]',
        3: '[--t-card-pad:--spacing(3)]',
        4: '[--t-card-pad:--spacing(4)]',
        5: '[--t-card-pad:--spacing(6)]',
        6: '[--t-card-pad:--spacing(8)]',
        7: '[--t-card-pad:--spacing(12)]',
        8: '[--t-card-pad:--spacing(16)]',
      },
    },
    defaultVariants: { variant: 'outline', padding: 4 },
  },
)

// A heading or paragraph placed directly in the header takes the header's type instead of its UA
// margins and size, so the tag level doesn't change the look.
export const tCardHeaderClasses = [
  '-mx-(--t-card-pad) box-border flex flex-wrap items-center justify-between gap-2',
  'border-b border-line px-(--t-card-pad) pb-(--t-card-pad) text-base leading-tight font-semibold',
  '[&>:is(h1,h2,h3,h4,h5,h6,p)]:m-0 [&>:is(h1,h2,h3,h4,h5,h6)]:[font:inherit]',
].join(' ')
export const tCardBodyClasses = 'min-w-0 flex-1'
export const tCardFooterClasses = [
  '-mx-(--t-card-pad) box-border flex flex-wrap items-center justify-end gap-2',
  'border-t border-line px-(--t-card-pad) pt-(--t-card-pad)',
].join(' ')
