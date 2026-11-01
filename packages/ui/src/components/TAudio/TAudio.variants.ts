import { cva } from 'class-variance-authority'

// The player spans the root's width. Hidden once nothing can be played: the fallback takes its place.
export const tAudioVariants = cva('w-full', {
  variants: {
    failed: {
      true: 'hidden',
      false: 'block',
    },
  },
  defaultVariants: { failed: false },
})

export const tAudioFallbackClasses = [
  'box-border flex w-full items-center gap-2 rounded-md border border-line bg-surface px-3 py-2',
  'text-sm text-fg-muted',
].join(' ')
