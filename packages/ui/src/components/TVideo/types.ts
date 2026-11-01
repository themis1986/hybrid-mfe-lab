import type { ComponentProps, ReactNode } from 'react'
import type { TMediaFit, TMediaRadius, TMediaRatio, TMediaSource, TMediaTrack } from '../../lib/media'

// `className` and `style` go on the root; every other prop (poster, loop, onPlay, onTimeUpdate…), `ref`
// included, goes on the <video>.
export interface TVideoProps extends Omit<ComponentProps<'video'>, 'children' | 'src'> {
  /** One file. Ignored when `sources` is given. */
  src?: string
  /** Alternative files (formats, resolutions); the browser plays the first it supports. */
  sources?: TMediaSource[]
  /** Captions, subtitles or chapters (WebVTT). */
  tracks?: TMediaTrack[]
  /** The box's ratio. */
  ratio?: TMediaRatio
  /** How the video fills its box (object-fit). */
  fit?: TMediaFit
  /** Corner rounding of the box. */
  radius?: TMediaRadius
  /** A line around the box. */
  bordered?: boolean
  /** Shown under the video; the root becomes a <figure>. */
  caption?: ReactNode
  /** Shown over the box when no source can be played. Defaults to an icon and `errorLabel`. */
  fallback?: ReactNode
  /** The default fallback's text. */
  errorLabel?: string
  /** Starts playing muted (browsers block autoplay with sound); skipped when the user prefers reduced motion. */
  autoPlay?: boolean
  /** 0 to 1. */
  volume?: number
  /** 1 is normal speed. */
  playbackRate?: number
  /** Where playback starts, in seconds. */
  startTime?: number
}
