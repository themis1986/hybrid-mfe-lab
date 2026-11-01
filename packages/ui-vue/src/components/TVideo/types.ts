import type { TMediaFit, TMediaRadius, TMediaRatio, TMediaSource, TMediaTrack } from '../../lib/media'

// `class` and `style` go on the root; every other attribute (poster, loop…) and listener (@play,
// @timeupdate…) goes on the <video>.
export interface TVideoProps {
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
  /** Shown under the video (or use the caption slot); the root becomes a <figure>. */
  caption?: string
  /** The default fallback's text, shown over the box when no source can be played. */
  errorLabel?: string
  /** Native controls. */
  controls?: boolean
  /** Plays inline on iOS instead of full screen. */
  playsinline?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  /** Starts playing muted (browsers block autoplay with sound); skipped when the user prefers reduced motion. */
  autoplay?: boolean
  muted?: boolean
  /** 0 to 1. */
  volume?: number
  /** 1 is normal speed. */
  playbackRate?: number
  /** Where playback starts, in seconds. */
  startTime?: number
}
