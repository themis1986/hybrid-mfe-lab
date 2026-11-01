import { cva } from 'class-variance-authority'

// The field is the box around the chips, the input and the chevron: TInput's look, but it grows with its
// chips (min-height; they wrap inside the values row, the chevron stays at the end) and draws the focus ring
// and the invalid and disabled states for the input inside it. self-start keeps a grid or flex row from
// stretching it to the row's height. Each implementation sets data-state="open" on it while the list is
// open, which turns the chevron (tSelectChevronClasses, through group/select). The list reuses TSelect's
// classes.
export const tComboboxFieldVariants = cva(
  [
    'group/select m-0 box-border flex w-full items-center gap-1 self-start cursor-text',
    'rounded-md border border-line-strong bg-canvas font-sans text-fg shadow-sm transition-colors duration-150 ease-out',
    'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
    'has-[[aria-invalid=true]]:border-danger has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-8 py-0.5 ps-3 pe-1 text-sm has-[[data-slot=combobox-chip]]:ps-1',
        md: 'min-h-9 py-1 ps-3 pe-1.5 text-sm has-[[data-slot=combobox-chip]]:ps-1',
        lg: 'min-h-11 py-1.5 ps-4 pe-2 text-base has-[[data-slot=combobox-chip]]:ps-1.5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const tComboboxValuesClasses =
  'flex min-w-0 flex-1 flex-wrap items-center gap-1'

// No Preflight: the input's own border, background, padding and font are reset here.
export const tComboboxInputClasses = [
  'm-0 box-border h-6 min-w-16 flex-1 border-0 bg-transparent p-0 font-sans text-[length:inherit] text-fg',
  'outline-none placeholder:text-fg-muted disabled:cursor-not-allowed',
].join(' ')

export const tComboboxChipClasses = [
  'inline-flex min-w-0 max-w-full items-center gap-0.5 rounded-sm bg-accent-subtle py-0.5 ps-2 pe-0.5',
  'text-xs leading-4 font-medium text-accent-fg',
].join(' ')
export const tComboboxChipLabelClasses = 'min-w-0 truncate'
export const tComboboxChipRemoveClasses = [
  'm-0 grid size-4 shrink-0 cursor-pointer place-items-center rounded-sm border-0 bg-transparent p-0 text-inherit',
  'hover:bg-accent-subtle-hover disabled:cursor-not-allowed',
].join(' ')
export const tComboboxChipIconClasses = 'size-3'

// Kept out of the tab order, as the chips' buttons: the input is the one focusable part.
export const tComboboxToggleClasses = [
  'my-0 ms-auto me-0 grid size-6 shrink-0 cursor-pointer place-items-center rounded-sm border-0 bg-transparent p-0',
  'disabled:cursor-not-allowed',
].join(' ')

export const tComboboxEmptyClasses = 'px-2 py-1.5 text-sm text-fg-muted'
