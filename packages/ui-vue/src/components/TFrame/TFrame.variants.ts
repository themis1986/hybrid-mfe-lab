import { cva } from 'class-variance-authority'
import { radiusVariants, ratioVariants } from '../../lib/media'

// The box spans its container's width. Its height comes from a ratio (16:9 by default, set by the
// component), a fixed height (inline), or, with autoHeight, the measured content of the frame.
export const tFrameBoxVariants = cva(
  'relative box-border w-full overflow-hidden',
  {
    variants: {
      ratio: ratioVariants,
      radius: radiusVariants,
      bordered: {
        true: 'border border-line',
        false: '',
      },
    },
    defaultVariants: { radius: 'none', bordered: false },
  },
)

// The iframe fills the box (its UA border removed), unless autoHeight sets its height inline.
export const tFrameVariants = cva('block w-full border-0 bg-transparent', {
  variants: {
    fill: {
      true: 'h-full',
      false: '',
    },
  },
  defaultVariants: { fill: true },
})
