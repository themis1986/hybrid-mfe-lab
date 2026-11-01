import type { ComponentProps, ReactNode } from 'react'
import type { TMediaSource } from '../../lib/media'

// `className` and `style` go on the root; every other prop (loop, muted, aria-label, onPlay, onEnded…),
// `ref` included, goes on the <audio>.
export interface TAudioProps extends Omit<
  ComponentProps<'audio'>,
  'children' | 'src'
> {
  /** One file. Ignored when `sources` is given. */
  src?: string
  /** Alternative files (formats); the browser plays the first it supports. */
  sources?: TMediaSource[]
  /** Shown under the player; the root becomes a <figure>. */
  caption?: ReactNode
  /** Shown in place of the player when no source can be played. Defaults to an icon and `errorLabel`. */
  fallback?: ReactNode
  /** The default fallback's text. */
  errorLabel?: string
  /** Starts playing on load (often blocked by browsers unless muted); skipped when the user prefers reduced motion. */
  autoPlay?: boolean
  /** 0 to 1. */
  volume?: number
  /** 1 is normal speed. */
  playbackRate?: number
  /** Where playback starts, in seconds. */
  startTime?: number
}
