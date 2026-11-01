// A month grid: a header (previous, heading, next) over one table per visible month. Every state is drawn
// from the data attributes Reka's Calendar sets (the React calendar sets the same ones): data-selected,
// data-today, data-outside-view, data-disabled, data-unavailable on each day's trigger, data-disabled on
// the previous/next buttons and on a disabled root. No Preflight: the table's spacing and the head cells'
// bold are reset here.

// The root lays out the optional presets column and the calendar body side by side, wrapping when narrow.
// self-start keeps a flex column or a grid from stretching it past its content.
export const tCalendarRootClasses = [
  'm-0 box-border inline-flex max-w-full flex-wrap items-start gap-4 self-start font-sans text-sm text-fg',
  'data-disabled:opacity-50',
].join(' ')

// Added to the root of a calendar shown on its own; inside a picker, the popover is the frame.
export const tCalendarFrameClasses = 'rounded-lg border border-line bg-canvas p-3 shadow-sm'

export const tCalendarBodyClasses = 'flex min-w-0 flex-col gap-3'
export const tCalendarHeaderClasses = 'flex items-center justify-between gap-2'
export const tCalendarHeadingClasses = 'flex-1 text-center text-sm font-semibold'
// Merged onto a ghost TButton (size sm): square, muted icon.
export const tCalendarNavClasses = 'w-8 px-0 text-fg-muted'

// Several months sit side by side and wrap below each other when the space runs out.
export const tCalendarMonthsClasses = 'flex flex-wrap gap-4'
export const tCalendarGridClasses = 'm-0 border-collapse border-spacing-0 select-none'
export const tCalendarHeadCellClasses = 'size-9 p-0 text-center text-xs font-normal text-fg-muted'
export const tCalendarCellClasses = 'relative p-0 text-center'

// A day. Days outside the month a grid shows are hidden: with several months they repeat a neighbour's.
// Hover only marks days that can be picked.
export const tCalendarCellTriggerClasses = [
  'm-0 box-border inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-sm tabular-nums',
  'outline-none transition-colors duration-150 ease-out',
  'not-data-disabled:not-data-unavailable:hover:bg-accent-subtle',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  'data-today:font-semibold data-today:text-accent-fg data-outside-view:invisible',
  'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  'data-unavailable:cursor-not-allowed data-unavailable:text-fg-muted data-unavailable:line-through',
].join(' ')

// The single-date calendar's selected day; the range calendar draws its own (TRangeCalendar.variants.ts).
// Its hover repeats the base hover's conditions, so it is the more specific rule and wins.
export const tCalendarSelectedClasses = [
  'data-selected:bg-accent data-selected:font-medium data-selected:text-accent-contrast',
  'data-selected:not-data-disabled:not-data-unavailable:hover:bg-accent-hover',
].join(' ')

// The presets column of a range calendar: a list of ghost buttons, as wide as its longest label.
export const tCalendarPresetsClasses = 'm-0 flex list-none flex-col gap-0.5 p-0'
// Merged onto a ghost TButton (size sm). The preset matching the current range is pressed (aria-pressed).
export const tCalendarPresetClasses = [
  'w-full justify-start font-normal text-fg',
  'aria-pressed:bg-accent-subtle aria-pressed:font-medium aria-pressed:text-accent-fg',
].join(' ')
