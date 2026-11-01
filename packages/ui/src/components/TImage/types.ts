import type { ComponentProps, ReactNode } from 'react'
import type { TMediaFit, TMediaRadius, TMediaRatio } from '../../lib/media'

// `className` and `style` go on the root; every other prop, `ref` included, goes on the <img>.
export interface TImageProps extends Omit<
  ComponentProps<'img'>,
  'children' | 'placeholder'
> {
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
  /** Shown in place of the image when it can't load. Defaults to an icon, named by `alt`. */
  fallback?: ReactNode
  /** Shown under the image; the root becomes a <figure>. */
  caption?: ReactNode
}
