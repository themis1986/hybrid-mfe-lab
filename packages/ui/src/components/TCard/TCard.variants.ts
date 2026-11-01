import { cva } from 'class-variance-authority'

// Padding model: one value, --t-card-pad (set by `padding`), is the card's padding, the gap between
// its parts, and the space between the header/footer divider and their content. The dividers span the
// content width only, so they are inset from the card's edges by the same padding, and the parts never
// add padding of their own. Change the padding through the `padding` prop, not a `p-*` class.
// `dividers: false` removes the header and footer lines together with the space on their inner side, so
// the parts are then separated by the gap alone. The root reaches its direct-child parts by `data-slot`.
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
      dividers: {
        true: '',
        false: [
          '[&>[data-slot=card-header]]:border-b-0 [&>[data-slot=card-header]]:pb-0',
          '[&>[data-slot=card-footer]]:border-t-0 [&>[data-slot=card-footer]]:pt-0',
        ],
      },
    },
    defaultVariants: { variant: 'outline', padding: 4, dividers: true },
  },
)

// A heading or paragraph placed directly in the header takes the header's type instead of its UA
// margins and size, so the tag level doesn't change the look.
export const tCardHeaderClasses = [
  'box-border flex flex-wrap items-center justify-between gap-2',
  'border-b border-line pb-(--t-card-pad) text-base leading-tight font-semibold',
  '[&>:is(h1,h2,h3,h4,h5,h6,p)]:m-0 [&>:is(h1,h2,h3,h4,h5,h6)]:[font:inherit]',
].join(' ')
export const tCardBodyClasses = 'min-w-0 flex-1'
export const tCardFooterClasses = [
  'box-border flex flex-wrap items-center justify-end gap-2',
  'border-t border-line pt-(--t-card-pad)',
].join(' ')
