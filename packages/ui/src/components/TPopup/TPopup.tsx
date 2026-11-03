import { createPopup, type Popup } from '@repo/map-core'
import { use, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import { MarkerContext, useLatest, useMapContext } from '../TMapView/context'
import { tPopupClasses } from './TPopup.variants'
import type { TPopupProps } from './types'

// A popup at a position, or, passed to a TMarker's `popup`, on that marker (opened by its click).
// Children render into the popup's content element through a portal.
export function TPopup({
  lngLat,
  open,
  onOpenChange,
  closeButton = true,
  anchor,
  offset,
  className,
  children,
}: TPopupProps) {
  const { map } = useMapContext('TPopup')
  const marker = use(MarkerContext)
  const [created, setCreated] = useState<{
    popup: Popup
    content: HTMLElement
  } | null>(null)
  const latest = useLatest({ offset, onOpenChange })

  useEffect(() => {
    const next = createPopup({
      closeButton,
      anchor,
      offset: latest.current.offset,
      className: cn(tPopupClasses, className),
    })
    const opened = () => latest.current.onOpenChange?.(true)
    const closed = () => latest.current.onOpenChange?.(false)
    next.popup.on('open', opened).on('close', closed)
    marker?.setPopup(next.popup)
    setCreated(next)
    return () => {
      setCreated(null)
      // Unmounting isn't the user closing it: no onOpenChange.
      next.popup.off('open', opened).off('close', closed)
      if (marker?.getPopup() === next.popup) marker.setPopup(null)
      next.popup.remove()
    }
  }, [map, marker, closeButton, anchor, className, latest])

  const [lng, lat] = lngLat ?? []
  useEffect(() => {
    if (!created) return
    const { popup } = created
    if (marker) {
      // The marker owns the position and toggles on click; only a controlled `open` forces it.
      if (open !== undefined && open !== popup.isOpen()) marker.togglePopup()
      return
    }
    if (lng === undefined || lat === undefined) return
    popup.setLngLat([lng, lat])
    if (open === false) popup.remove()
    else if (!popup.isOpen()) popup.addTo(map)
  }, [created, marker, map, open, lng, lat])

  useEffect(() => {
    if (created && offset !== undefined) created.popup.setOffset(offset)
  }, [created, offset])

  return created && createPortal(children, created.content)
}
