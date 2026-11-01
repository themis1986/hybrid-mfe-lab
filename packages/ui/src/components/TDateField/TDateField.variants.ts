import { cva } from 'class-variance-authority'

// The field is the box around the segments (day, month, year, or a time's parts): TInput's look, with the
// focus ring drawn for whichever segment has focus. Reka's DateField, DateRangeField and TimeField roots set
// data-disabled, data-readonly and data-invalid (an out-of-range or unavailable value); the React fields
// set the same. The `invalid` prop sets aria-invalid on the root instead, since Reka overrides a passed
// data-invalid. The date pickers put a calendar button at its end, so the end padding is the smaller one.
// self-start keeps a grid or flex row from stretching it.
export const tDateFieldVariants = cva(
  [
    'm-0 box-border flex w-full items-center gap-1 self-start cursor-text',
    'rounded-md border border-line-strong bg-canvas font-sans text-fg shadow-sm transition-colors duration-150 ease-out',
    'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
    'data-invalid:border-danger aria-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 ps-3 pe-1 text-sm',
        md: 'h-9 ps-3 pe-1.5 text-sm',
        lg: 'h-11 ps-4 pe-2 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// The segments row; it clips rather than wrapping when the field is narrower than the date.
export const tDateFieldSegmentsClasses =
  'flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap'

// Each segment is an editable span (role spinbutton) marked with data-reka-date-field-segment="<part>"
// (data-reka-time-field-segment in a time field); literals are the separators between them. An empty
// segment shows its placeholder (mm, dd, yyyy) muted.
export const tDateFieldSegmentClasses = [
  'rounded-sm px-0.5 tabular-nums caret-transparent outline-none',
  'focus:bg-accent-subtle focus:text-accent-fg data-placeholder:text-fg-muted focus:data-placeholder:text-accent-fg',
  'data-[reka-date-field-segment=literal]:px-0 data-[reka-date-field-segment=literal]:text-fg-muted',
  'data-[reka-time-field-segment=literal]:px-0 data-[reka-time-field-segment=literal]:text-fg-muted',
  'data-disabled:cursor-not-allowed',
].join(' ')

// Between a range's start and end segments.
export const tDateFieldSeparatorClasses = 'px-1 text-fg-muted'

// The date pickers' calendar button, at the field's end. It is focusable: it is the way to the calendar.
export const tDateFieldTriggerClasses = [
  'my-0 ms-auto me-0 grid size-6 shrink-0 cursor-pointer place-items-center rounded-sm border-0 bg-transparent p-0',
  'text-fg-muted not-disabled:hover:bg-accent-subtle not-disabled:hover:text-accent-fg',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  'disabled:cursor-not-allowed',
].join(' ')
