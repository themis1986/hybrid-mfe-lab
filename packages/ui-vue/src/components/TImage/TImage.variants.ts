import { cva } from 'class-variance-authority'
import { fitVariants, radiusVariants, ratioVariants } from '../../lib/media'

// The box around the image. With a ratio it spans its container's width and the image fills it (cropped
// or letterboxed, as `fit` says); without one it hugs the image, which keeps its own ratio and never grows
// wider than the container. `pending` is the skeleton shown while the image loads.
export const tImageFrameVariants = cva('relative box-border overflow-hidden', {
  variants: {
    ratio: ratioVariants,
    sized: {
      true: 'w-full',
      false: 'w-fit max-w-full',
    },
    radius: radiusVariants,
    bordered: {
      true: 'border border-line',
      false: '',
    },
    pending: {
      true: 'bg-surface animate-pulse motion-reduce:animate-none',
      false: '',
    },
  },
  defaultVariants: { radius: 'none', bordered: false, pending: false },
})

// Hidden once it fails for good: the fallback takes its place.
export const tImageVariants = cva('max-w-full', {
  variants: {
    sized: {
      true: 'size-full',
      false: 'h-auto',
    },
    fit: fitVariants,
    failed: {
      true: 'hidden',
      false: 'block',
    },
  },
  defaultVariants: { fit: 'cover', failed: false },
})

export const tImageFallbackClasses = [
  'box-border flex size-full min-h-24 min-w-24 flex-col items-center justify-center gap-2 p-4',
  'bg-surface text-center text-sm text-fg-muted',
].join(' ')
