import type { TMediaSource } from '../../lib/media'

// `class` and `style` go on the root; every other attribute (loop, aria-label…) and listener (@play,
// @ended…) goes on the <audio>.
export interface TAudioProps {
  /** One file. Ignored when `sources` is given. */
  src?: string
  /** Alternative files (formats); the browser plays the first it supports. */
  sources?: TMediaSource[]
  /** Shown under the player (or use the caption slot); the root becomes a <figure>. */
  caption?: string
  /** The default fallback's text, shown in place of the player when no source can be played. */
  errorLabel?: string
  /** Native controls. */
  controls?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  /** Starts playing on load (often blocked by browsers unless muted); skipped when the user prefers reduced motion. */
  autoplay?: boolean
  /** 0 to 1. */
  volume?: number
  /** 1 is normal speed. */
  playbackRate?: number
  /** Where playback starts, in seconds. */
  startTime?: number
}
