import { cva } from 'class-variance-authority'

// The content is portalled to the end of <body>, outside the app's own container: it sets its font and
// colour itself, and z-50 keeps it above the app frame's sticky header. Each library maps its primitive's
// available-height and transform-origin variables onto --t-dropdown-menu-*. The transition only runs on
// entry (@starting-style), as TPopover's: closing is instant.
export const tDropdownMenuContentClasses = [
  'z-50 m-0 box-border flex max-h-(--t-dropdown-menu-available-height) max-w-[calc(100vw-2rem)] min-w-44 flex-col overflow-y-auto',
  'rounded-lg border border-line bg-canvas p-1 font-sans text-sm text-fg shadow-lg outline-none',
  'origin-(--t-dropdown-menu-transform-origin) transition-[opacity,scale] duration-150 ease-out',
  'starting:scale-95 starting:opacity-0 motion-reduce:transition-none',
].join(' ')

export const tDropdownMenuItemVariants = cva(
  [
    'flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 outline-none select-none',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      tone: {
        neutral: 'text-fg data-highlighted:bg-accent-subtle',
        danger: 'text-danger-fg data-highlighted:bg-danger-subtle',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export const tDropdownMenuLabelClasses =
  'px-2 py-1.5 text-xs font-medium text-fg-muted'
export const tDropdownMenuSeparatorClasses = 'my-1 h-px bg-line'
