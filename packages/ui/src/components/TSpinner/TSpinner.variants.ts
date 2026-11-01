import { cva } from 'class-variance-authority'

// The ring is drawn in currentColor: accent by default, and a caller's text-* class wins through `cn`
// (text-current inside a button). The first three sizes match TIcon's.
export const tSpinnerVariants = cva('inline-block shrink-0 text-accent', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
    },
  },
  defaultVariants: { size: 'md' },
})

// With reduced motion it still turns, slowly: a still spinner reads as frozen.
export const tSpinnerSvgClasses = 'block size-full animate-spin motion-reduce:[animation-duration:2.5s]'
// The full ring behind the turning arc.
export const tSpinnerTrackClasses = 'opacity-25'
