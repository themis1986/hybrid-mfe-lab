import type { Anchor, LngLatTuple } from '@repo/map-core'
import type { ReactNode } from 'react'

export interface TPopupProps {
  /** Where it points. Ignored when the popup is passed to a TMarker (it points at the marker). */
  lngLat?: LngLatTuple
  /**
   * Controlled open state. Unset: a standalone popup is open, a marker's popup opens on the marker's
   * click. The close button and map clicks report through `onOpenChange`.
   */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeButton?: boolean
  /** Which side of the popup points at the position (fixed at creation). Unset: the side with room. */
  anchor?: Anchor
  /** Pixels away from the position. */
  offset?: number | [number, number]
  className?: string
  children?: ReactNode
}
