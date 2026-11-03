import { bindFeatureEvents, type LayerSpecification } from '@repo/map-core'
import { useEffect } from 'react'
import { useLatest, useMapContext, useOwner } from '../TMapView/context'
import type { TLayerProps } from './types'

// Escape hatch: any layer spec the engine accepts (heatmap, fill-extrusion, a vector source's layer…).
export function TLayer({
  id,
  spec,
  beforeId,
  slot,
  onFeatureClick,
  onFeatureEnter,
  onFeatureLeave,
}: TLayerProps) {
  const { layers } = useMapContext('TLayer')
  const owner = useOwner()
  const full = { ...spec, id } as LayerSpecification
  const placement = { beforeId, slot }
  const latest = useLatest({
    full,
    placement,
    handlers: {
      click: onFeatureClick,
      enter: onFeatureEnter,
      leave: onFeatureLeave,
    },
  })

  useEffect(() => {
    layers.addLayer(owner, latest.current.full, latest.current.placement)
    const unbind = bindFeatureEvents(layers, id, () => latest.current.handlers)
    return () => {
      unbind()
      layers.removeLayer(owner, id)
    }
  }, [layers, owner, id, latest])

  // In-place updates: no-ops when nothing changed (the manager compares).
  useEffect(() => {
    layers.updateLayer(owner, full, placement)
  })

  return null
}
