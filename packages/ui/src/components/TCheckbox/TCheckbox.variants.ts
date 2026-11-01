import { cva } from 'class-variance-authority'

// The root is a <button role="checkbox"> drawn in its unchecked look. The indicator, which Radix (React)
// and Reka (Vue) mount only while checked or indeterminate, covers it with the checked look, so neither
// part needs data-state rules. TSelect reuses both strings on the decorative indicators of its options.
// No Preflight: the base classes also reset the browser's default button look.
export const tCheckboxVariants = cva(
  [
    'relative m-0 box-border inline-block shrink-0 rounded-sm border border-line-strong bg-canvas p-0 cursor-pointer',
    'shadow-sm transition-colors duration-150 ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// -inset-px also covers the root's border. The indicator carries data-state, which picks the icon.
export const tCheckboxIndicatorClasses =
  'group absolute -inset-px grid place-items-center rounded-[inherit] bg-accent text-accent-contrast'
export const tCheckboxIconClasses = 'size-3/4 stroke-3 group-data-[state=indeterminate]:hidden'
export const tCheckboxIndeterminateIconClasses = 'hidden size-3/4 stroke-3 group-data-[state=indeterminate]:block'
