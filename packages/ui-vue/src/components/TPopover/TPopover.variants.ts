import { cva } from 'class-variance-authority'

// The content is portalled to the end of <body>, outside the app's own container: it sets its font and
// colour itself, and z-50 keeps it above the app frame's sticky header. It is as tall as the space next to
// the trigger allows and scrolls beyond that; it grows out of the trigger's side. Each library maps its
// primitive's available-height and transform-origin variables onto --t-popover-*. The transition only runs
// on entry (@starting-style), as TDialog's: closing is instant.
export const tPopoverContentVariants = cva(
  [
    'z-50 m-0 box-border flex max-h-(--t-popover-available-height) max-w-[calc(100vw-2rem)] flex-col gap-4 overflow-y-auto',
    'rounded-lg border border-line bg-canvas p-4 font-sans text-sm text-fg shadow-lg outline-none',
    'origin-(--t-popover-transform-origin) transition-[opacity,scale] duration-150 ease-out',
    'starting:scale-95 starting:opacity-0 motion-reduce:transition-none',
  ],
  {
    variants: {
      size: {
        sm: 'w-64',
        md: 'w-80',
        lg: 'w-[26rem]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// The header's end padding (a longhand) keeps the title clear of the close button.
export const tPopoverHeaderClasses = 'flex flex-col gap-1 pe-8'
export const tPopoverTitleClasses =
  'm-0 font-sans text-base leading-tight font-semibold'
export const tPopoverDescriptionClasses = 'm-0 text-sm text-fg-muted'
export const tPopoverFooterClasses =
  'flex flex-wrap items-center justify-end gap-2'
// Merged onto a ghost TButton.
export const tPopoverCloseClasses =
  'absolute end-3 top-3 h-7 w-7 px-0 text-fg-muted'
