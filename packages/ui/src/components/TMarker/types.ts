import type { Anchor, LngLatTuple } from '@repo/map-core'
import type { ReactNode } from 'react'

export interface TMarkerProps {
  lngLat: LngLatTuple
  /** The user can drag it; `onDragEnd` reports where it was dropped. */
  draggable?: boolean
  /** Which part of the marker sits on `lngLat` (fixed at creation). */
  anchor?: Anchor
  /** Pixels, [x, y]. */
  offset?: [number, number]
  onClick?: (event: MouseEvent) => void
  onDragEnd?: (lngLat: LngLatTuple) => void
  /** A TPopup that opens when the marker is clicked. */
  popup?: ReactNode
  /** Custom content. Without children, the engine's default pin. Decided when the marker mounts. */
  children?: ReactNode
}
