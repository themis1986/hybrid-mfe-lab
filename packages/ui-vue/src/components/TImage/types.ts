import type { TMediaFit, TMediaRadius, TMediaRatio } from '../../lib/media'

// `class` and `style` go on the root; every other attribute (srcset, sizes, width…) and listener goes on the <img>.
export interface TImageProps {
  src?: string
  /** Text alternative. Required: pass '' for a decorative image. */
  alt: string
  /** The box's ratio; the image then fills the box's width. Without one, the box hugs the image. */
  ratio?: TMediaRatio
  /** How the image fills its box (object-fit). */
  fit?: TMediaFit
  /** Which part stays visible when the image is cropped (object-position), e.g. 'top' or '30% 60%'. */
  position?: string
  /** Corner rounding of the box. */
  radius?: TMediaRadius
  /** A line around the box. */
  bordered?: boolean
  /** Shown while the image loads: a pulsing surface, or nothing. */
  placeholder?: 'skeleton' | 'none'
  /** Tried once when `src` fails to load. */
  fallbackSrc?: string
  /** Shown under the image (or use the caption slot); the root becomes a <figure>. */
  caption?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
}
