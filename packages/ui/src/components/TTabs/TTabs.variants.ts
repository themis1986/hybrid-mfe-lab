import { cva } from 'class-variance-authority'

export const tTabsClasses =
  'flex flex-col gap-4 data-[orientation=vertical]:flex-row'

// The list styles its triggers (direct children) for its variant; Radix and Reka set data-state="active"
// on the selected one. It scrolls sideways when the tabs don't fit.
// - line: an underline under the selected tab, over a 1px rule (an inset shadow, so the overflow
//   doesn't clip the 2px underline that sits on it);
// - pills: the selected tab is a raised chip on a sunken track.
export const tTabsListVariants = cva(
  'flex max-w-full shrink-0 overflow-x-auto',
  {
    variants: {
      variant: {
        line: [
          'gap-4 shadow-[inset_0_-1px_0_var(--t-color-line)]',
          '*:border-b-2 *:border-transparent *:px-1 *:pt-1 *:pb-2.5',
          '*:data-[state=active]:border-accent *:data-[state=active]:text-fg',
        ],
        pills: [
          'w-fit gap-1 rounded-lg bg-surface p-1',
          '*:rounded-md *:px-3 *:py-1.5',
          '*:data-[state=active]:bg-canvas *:data-[state=active]:text-fg *:data-[state=active]:shadow-sm',
        ],
      },
    },
    defaultVariants: { variant: 'line' },
  },
)

// No Preflight: the base classes reset the browser's button look. The list's variant adds the shape.
export const tTabsTriggerClasses = [
  'm-0 inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 border-0 bg-transparent whitespace-nowrap',
  'font-sans text-sm font-medium text-fg-muted transition-colors duration-150 ease-out not-disabled:hover:text-fg',
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ')

export const tTabsContentClasses =
  'rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
