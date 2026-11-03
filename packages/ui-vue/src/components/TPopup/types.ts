import type { Anchor, LngLatTuple } from '@repo/map-core'

// Event: update:open (v-model:open), from the close button and map clicks. `class` goes on the popup.
export interface TPopupProps {
  /** Where it points. Ignored in a TMarker's popup slot (it points at the marker). */
  lngLat?: LngLatTuple
  /** Controlled open state. Unset: a standalone popup is open, a marker's popup opens on the marker's click. */
  open?: boolean
  closeButton?: boolean
  /** Which side of the popup points at the position (fixed at creation). Unset: the side with room. */
  anchor?: Anchor
  /** Pixels away from the position. */
  offset?: number | [number, number]
}
