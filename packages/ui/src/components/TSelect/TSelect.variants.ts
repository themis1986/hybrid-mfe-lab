// The trigger is a TInput look-alike: these classes are merged after tInputVariants, so the select has the
// input's border, height, invalid state and focus ring. Radix (React) and Reka (Vue) both set
// data-placeholder while nothing is selected and data-state="open" while the list is open.
export const tSelectTriggerClasses = [
  'group/select inline-flex items-center justify-between gap-2 text-start cursor-pointer',
  'data-placeholder:text-fg-muted',
].join(' ')
export const tSelectValueClasses = 'min-w-0 flex-1 truncate'
export const tSelectChevronClasses =
  'size-4 text-fg-muted transition-transform duration-150 ease-out group-data-[state=open]/select:rotate-180'

// The list is portalled to the end of <body>, outside the app's own container: it sets its font and
// colour itself, and z-50 keeps it above the app frame's sticky header. Each primitive names its width
// and height variables differently, so every implementation maps its own onto --t-select-trigger-width
// and --t-select-available-height, and these strings stay identical in both libraries.
export const tSelectContentClasses = [
  'z-50 m-0 box-border flex min-w-(--t-select-trigger-width) max-h-[min(20rem,var(--t-select-available-height))] flex-col',
  'overflow-hidden rounded-md border border-line bg-canvas font-sans text-fg shadow-lg outline-none',
  'transition-opacity duration-150 ease-out starting:opacity-0 motion-reduce:transition-none',
].join(' ')
export const tSelectViewportClasses = 'min-h-0 flex-1 overflow-y-auto p-1 outline-none'

// Radix and Reka set data-highlighted, data-state and data-disabled on their items; the React multiple
// list sets the same attributes on its options.
export const tSelectItemClasses = [
  'relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
  'data-highlighted:bg-accent-subtle data-disabled:cursor-not-allowed data-disabled:opacity-50',
].join(' ')

// Merged onto an option's decorative checkbox or radio (their variants, at size sm): the option takes the
// pointer, and the indicator is flat inside the list.
export const tSelectIndicatorClasses = 'pointer-events-none shadow-none'
