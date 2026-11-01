import type { ComponentProps, ReactNode } from 'react'
import type { TMediaRadius, TMediaRatio } from '../../lib/media'

// `className` and `style` go on the root; every other prop (name, allowFullScreen, onLoad…), `ref`
// included, goes on the <iframe>.
export interface TFrameProps extends Omit<ComponentProps<'iframe'>, 'children' | 'title' | 'sandbox' | 'allow' | 'height'> {
  /** The page to embed. */
  src?: string
  /** Inline HTML to embed instead of `src`. */
  srcDoc?: string
  /** The frame's accessible name. Required. */
  title: string
  /** The box's ratio. Ignored with `height` or a measured `autoHeight`. */
  ratio?: TMediaRatio
  /** A fixed height instead of a ratio: a number is pixels, a string any CSS length. */
  height?: string | number
  /**
   * Grows and shrinks with the embedded document. Same-origin content only (srcDoc, or a same-origin URL,
   * not sandboxed without allow-same-origin); otherwise the ratio applies.
   */
  autoHeight?: boolean
  /** Restrictions: true applies all, or a list of what to allow back (e.g. ['allow-scripts', 'allow-forms']). */
  sandbox?: boolean | string | string[]
  /** Permissions policy, e.g. ['fullscreen', 'clipboard-write']. */
  allow?: string | string[]
  /** Corner rounding of the box. */
  radius?: TMediaRadius
  /** A line around the box. */
  bordered?: boolean
  /** Shown under the frame; the root becomes a <figure>. */
  caption?: ReactNode
  /** A spinner over the box until the frame has loaded. */
  showLoader?: boolean
  /** The spinner's announced label. */
  loadingLabel?: string
}
