import { cva } from 'class-variance-authority'

// Radix (React) and Reka (Vue) set data-orientation on every part and data-disabled on the root and thumbs.
export const tSliderClasses = [
  'relative flex touch-none items-center select-none',
  'data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40',
  'data-[orientation=vertical]:flex-col data-disabled:cursor-not-allowed data-disabled:opacity-50',
].join(' ')

export const tSliderTrackVariants = cva('relative grow overflow-hidden rounded-full bg-control', {
  variants: {
    size: {
      sm: 'data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1',
      md: 'data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5',
    },
  },
  defaultVariants: { size: 'md' },
})

export const tSliderRangeClasses =
  'absolute rounded-full bg-accent data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'

export const tSliderThumbVariants = cva(
  [
    'block shrink-0 cursor-grab rounded-full border-2 border-accent bg-control-thumb shadow-sm',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'data-disabled:cursor-not-allowed',
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
