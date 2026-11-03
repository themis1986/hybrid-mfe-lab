import { createMarker, type Marker, toLngLat } from '@repo/map-core'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MarkerContext, useLatest, useMapContext } from '../TMapView/context'
import type { TMarkerProps } from './types'

// A DOM marker: fine for a handful of interactive points. For many points, use a TGeoJsonLayer (drawn
// in WebGL, clusterable). Children render into the marker's element through a portal.
export function TMarker({
  lngLat,
  draggable = false,
  anchor,
  offset,
  onClick,
  onDragEnd,
  popup,
  children,
}: TMarkerProps) {
  const { map } = useMapContext('TMarker')
  const [element] = useState(() => document.createElement('div'))
  const [custom] = useState(() => children != null)
  const [marker, setMarker] = useState<Marker | null>(null)
  const latest = useLatest({ lngLat, draggable, offset, onClick, onDragEnd })

  useEffect(() => {
    const { lngLat, draggable, offset } = latest.current
    const created = createMarker(map, {
      lngLat,
      element: custom ? element : undefined,
      draggable,
      anchor,
      offset,
    })
    created.on('dragend', () =>
      latest.current.onDragEnd?.(toLngLat(created.getLngLat())),
    )
    // On the marker's own element, so the default pin reports clicks too. The custom element outlives
    // this marker (StrictMode re-creates it), so the listener is removed with it.
    const target = created.getElement()
    const click = (event: MouseEvent) => latest.current.onClick?.(event)
    target.addEventListener('click', click)
    setMarker(created)
    return () => {
      setMarker(null)
      target.removeEventListener('click', click)
      created.remove()
    }
  }, [map, element, custom, anchor, latest])

  const [lng, lat] = lngLat
  useEffect(() => {
    marker?.setLngLat([lng, lat])
  }, [marker, lng, lat])

  useEffect(() => {
    marker?.setDraggable(draggable)
  }, [marker, draggable])

  const [x = 0, y = 0] = offset ?? []
  useEffect(() => {
    marker?.setOffset([x, y])
  }, [marker, x, y])

  return (
    <MarkerContext value={marker}>
      {custom &&
        createPortal(<div data-slot="marker">{children}</div>, element)}
      {marker && popup}
    </MarkerContext>
  )
}
