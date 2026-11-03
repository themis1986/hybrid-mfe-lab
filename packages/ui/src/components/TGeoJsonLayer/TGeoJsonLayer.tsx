import {
  bindFeatureEvents,
  clusterLayerIds,
  createGeoJsonLoader,
  type GeoJSON,
  geoJsonLayers,
  geoJsonSource,
} from '@repo/map-core'
import { useEffect, useState } from 'react'
import { useLatest, useMapContext, useOwner } from '../TMapView/context'
import type { TGeoJsonLayerProps } from './types'

const EMPTY: GeoJSON = { type: 'FeatureCollection', features: [] }

// GeoJSON drawn in WebGL: points (optionally clustered), lines or polygons, from inline data or a URL. The
// map's layer manager adds it once and turns later prop changes into in-place updates.
export function TGeoJsonLayer({
  id,
  data,
  type,
  paint,
  layout,
  filter,
  beforeId,
  slot,
  visible = true,
  cluster,
  minzoom,
  maxzoom,
  refreshInterval,
  onStatusChange,
  onFeatureClick,
  onFeatureEnter,
  onFeatureLeave,
}: TGeoJsonLayerProps) {
  const { layers } = useMapContext('TGeoJsonLayer')
  const owner = useOwner()
  const url = typeof data === 'string' ? data : undefined
  const [remote, setRemote] = useState<GeoJSON>()
  const geojson = url ? (remote ?? EMPTY) : (data as GeoJSON)

  const spec = {
    id,
    type,
    paint,
    layout,
    filter,
    visible,
    cluster,
    minzoom,
    maxzoom,
  }
  const placement = { beforeId, slot }
  const latest = useLatest({
    geojson,
    spec,
    placement,
    onStatusChange,
    handlers: {
      click: onFeatureClick,
      enter: onFeatureEnter,
      leave: onFeatureLeave,
    },
  })

  // Added once per id (and clustering on/off, which changes the set of layers); removed on unmount.
  const clustered = Boolean(cluster)
  useEffect(() => {
    const { geojson, spec, placement } = latest.current
    const specs = geoJsonLayers(spec)
    layers.addSource(owner, id, geoJsonSource(geojson, spec.cluster))
    specs.forEach((layer) => layers.addLayer(owner, layer, placement))
    const unbind = bindFeatureEvents(
      layers,
      id,
      () => latest.current.handlers,
      clustered ? clusterLayerIds(id).clusters : undefined,
    )
    return () => {
      unbind()
      specs.forEach((layer) => layers.removeLayer(owner, layer.id))
      layers.removeSource(owner, id)
    }
  }, [layers, owner, id, clustered, latest])

  // In-place updates: no-ops when nothing changed (the manager compares).
  const clusterKey = JSON.stringify(cluster)
  useEffect(() => {
    layers.updateSource(owner, id, geoJsonSource(geojson, cluster))
    // cluster is compared by value.
  }, [layers, owner, id, geojson, clusterKey])

  useEffect(() => {
    geoJsonLayers(spec).forEach((layer) =>
      layers.updateLayer(owner, layer, placement),
    )
  })

  // URL data: fetched here, aborted when the URL changes or the layer unmounts.
  useEffect(() => {
    if (!url) return
    const loader = createGeoJsonLoader((state) => {
      setRemote(state.data)
      latest.current.onStatusChange?.(state.status, state.error)
    })
    loader.load(url, { refreshInterval })
    return () => loader.dispose()
  }, [url, refreshInterval, latest])

  return null
}
