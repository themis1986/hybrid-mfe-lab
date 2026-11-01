import { cva } from 'class-variance-authority'

export const tRadioGroupVariants = cva('flex', {
  variants: {
    orientation: {
      vertical: 'flex-col gap-2',
      horizontal: 'flex-wrap gap-x-4 gap-y-2',
    },
  },
  defaultVariants: { orientation: 'vertical' },
})

// Each item is a <button role="radio"> drawn in its unchecked look. The indicator, which Radix (React) and
// Reka (Vue) mount only while checked, covers it with the checked look: an accent disc with a dot. TSelect
// reuses both strings on the decorative indicators of its options.
export const tRadioVariants = cva(
  [
    'relative m-0 box-border inline-block shrink-0 rounded-full border border-line-strong bg-canvas p-0 cursor-pointer',
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

// -inset-px also covers the root's border.
export const tRadioIndicatorClasses =
  'absolute -inset-px grid place-items-center rounded-full bg-accent after:size-2/5 after:rounded-full after:bg-accent-contrast'
