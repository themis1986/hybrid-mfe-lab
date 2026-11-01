import { cva } from 'class-variance-authority'
import { fitVariants, radiusVariants, ratioVariants } from '../../lib/media'

// The box spans its container's width at a fixed ratio (16:9 by default, set by the component); the
// video fills it, letterboxed by default (`fit`). The surface shows until the first frame or poster.
export const tVideoFrameVariants = cva('relative box-border w-full overflow-hidden bg-surface', {
  variants: {
    ratio: ratioVariants,
    radius: radiusVariants,
    bordered: {
      true: 'border border-line',
      false: '',
    },
  },
  defaultVariants: { radius: 'none', bordered: false },
})

export const tVideoVariants = cva('block size-full', {
  variants: {
    fit: fitVariants,
  },
  defaultVariants: { fit: 'contain' },
})
