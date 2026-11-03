import { rasterTileLayer, rasterTileSource } from '@repo/map-core'
import { useEffect } from 'react'
import { useLatest, useMapContext, useOwner } from '../TMapView/context'
import type { TRasterTileLayerProps } from './types'

// Raster tiles from an XYZ URL template (an overlay, or a basemap of your own).
export function TRasterTileLayer({
  id,
  tiles,
  tileSize,
  attribution,
  opacity,
  visible = true,
  minzoom,
  maxzoom,
  beforeId,
  slot,
}: TRasterTileLayerProps) {
  const { layers } = useMapContext('TRasterTileLayer')
  const owner = useOwner()
  const spec = {
    id,
    tiles: typeof tiles === 'string' ? [tiles] : tiles,
    tileSize,
    attribution,
    opacity,
    visible,
    minzoom,
    maxzoom,
  }
  const placement = { beforeId, slot }
  const latest = useLatest({ spec, placement })

  useEffect(() => {
    const { spec, placement } = latest.current
    layers.addSource(owner, id, rasterTileSource(spec))
    layers.addLayer(owner, rasterTileLayer(spec), placement)
    return () => {
      layers.removeLayer(owner, id)
      layers.removeSource(owner, id)
    }
  }, [layers, owner, id, latest])

  // In-place updates: no-ops when nothing changed (the manager compares).
  useEffect(() => {
    layers.updateSource(owner, id, rasterTileSource(spec))
    layers.updateLayer(owner, rasterTileLayer(spec), placement)
  })

  return null
}
