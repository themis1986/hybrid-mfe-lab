import type { Anchor, LngLatTuple } from '@repo/map-core'

// Events: click (MouseEvent), dragend (LngLatTuple). Slots: default (custom content; without it, the
// engine's default pin, decided when the marker mounts), popup (a TPopup opened by the marker's click).
export interface TMarkerProps {
  lngLat: LngLatTuple
  /** The user can drag it; `dragend` reports where it was dropped. */
  draggable?: boolean
  /** Which part of the marker sits on `lngLat` (fixed at creation). */
  anchor?: Anchor
  /** Pixels, [x, y]. */
  offset?: [number, number]
}
