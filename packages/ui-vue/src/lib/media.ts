// Shared by the media components (image, video, audio, embedded frame): their prop types, class maps and
// the helpers that turn props into attributes. Identical in both libraries. Class names are written out in
// full so Tailwind's scanner finds them.

/** A preset, or a number: width divided by height (e.g. 1.5). */
export type TMediaRatio = 'square' | '4-3' | '3-2' | '16-9' | '21-9' | number
/** How the media fills its box (CSS object-fit). */
export type TMediaFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
export type TMediaRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'
/** Exposed as the root's data-state. */
export type TMediaStatus = 'loading' | 'loaded' | 'error'

/** One <source> of a video or audio element; the browser plays the first it supports. */
export interface TMediaSource {
  src: string
  /** MIME type, e.g. 'video/webm'; lets the browser skip formats it can't play without fetching them. */
  type?: string
  /** A media query the source applies to. */
  media?: string
}

/** One <track> of a video: captions, subtitles, chapters… (WebVTT). */
export interface TMediaTrack {
  src: string
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata'
  /** Language of the track, e.g. 'en'. */
  srcLang?: string
  /** Shown in the player's track menu. */
  label?: string
  /** Enabled by default. */
  default?: boolean
}

export const ratioVariants = {
  square: 'aspect-square',
  '4-3': 'aspect-[4/3]',
  '3-2': 'aspect-[3/2]',
  '16-9': 'aspect-video',
  '21-9': 'aspect-[21/9]',
} as const

export const fitVariants = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
} as const

export const radiusVariants = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

// The root holds the media box and its caption. It is a <figure> when there is a caption (UA margins reset).
export const mediaRootClasses = 'm-0 box-border flex min-w-0 flex-col items-start gap-2 text-fg'
export const mediaCaptionClasses = 'text-sm text-fg-muted'
// Covers the media box: the loader of a frame, the error state of a video.
export const mediaOverlayClasses = [
  'absolute inset-0 box-border flex flex-col items-center justify-center gap-2 p-4',
  'bg-surface text-center text-sm text-fg-muted',
].join(' ')

/** The preset key for the class map; null for a numeric ratio (set inline, see ratioValue) or none. */
export function ratioPreset(ratio: TMediaRatio | undefined) {
  return typeof ratio === 'string' ? ratio : null
}

/** A numeric ratio, for an inline `aspect-ratio`. */
export function ratioValue(ratio: TMediaRatio | undefined) {
  return typeof ratio === 'number' ? ratio : undefined
}

/** A number is pixels; a string is any CSS length. */
export function toLength(value: string | number | undefined) {
  return typeof value === 'number' ? `${value}px` : value
}

/** The sandbox attribute: true applies every restriction (''), a list is space-separated, false/undefined omits it. */
export function toSandbox(value: boolean | string | string[] | undefined) {
  if (value === undefined || value === false) return undefined
  if (value === true) return ''
  return Array.isArray(value) ? value.join(' ') : value
}

/** The allow attribute (permissions policy): a list is joined with '; '. */
export function toAllow(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.join('; ') : value
}

/** A key that changes with the sources: the media element is re-created then, since changing <source> children doesn't reload it. */
export function sourcesKey(src: string | undefined, sources: TMediaSource[] | undefined) {
  return sources?.length ? sources.map((source) => source.src).join(' ') : (src ?? '')
}

export function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Sets the playback properties that have no HTML attribute; undefined leaves the element's own value. */
export function applyPlayback(el: HTMLMediaElement, options: { volume?: number; playbackRate?: number }) {
  if (options.volume !== undefined) el.volume = Math.min(1, Math.max(0, options.volume))
  if (options.playbackRate !== undefined) el.playbackRate = options.playbackRate
}

/**
 * Reports the height of a loaded frame's document, now and whenever it changes. Works only when the frame
 * is same-origin (srcdoc, or a same-origin URL without a sandbox that removes allow-same-origin); returns
 * undefined otherwise. Returns the function that stops observing.
 */
export function observeContentHeight(frame: HTMLIFrameElement, onHeight: (height: number) => void) {
  let doc: Document | null = null
  try {
    doc = frame.contentDocument
  } catch {
    return undefined
  }
  const win = frame.contentWindow as (Window & typeof globalThis) | null
  if (!doc?.documentElement || !win?.ResizeObserver) return undefined

  const root = doc.documentElement
  const report = () => onHeight(Math.ceil(root.getBoundingClientRect().height))
  // The frame's own ResizeObserver: an observer from the parent window doesn't see another document's layout.
  const observer = new win.ResizeObserver(report)
  observer.observe(root)
  report()
  return () => observer.disconnect()
}
