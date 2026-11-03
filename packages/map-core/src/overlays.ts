import type { Feature } from 'geojson'
import mapboxgl from 'mapbox-gl'
import type { Anchor, GeoJSONSource, Marker, Popup } from 'mapbox-gl'
import type { LayerManager } from './LayerManager'
import type {
  FeatureEvent,
  LngLatTuple,
  MapInstance,
  MapMouseEvent,
} from './types'

export type { Anchor, Marker, Popup }

export interface MarkerOptions {
  lngLat: LngLatTuple
  /** Custom content; without it, the engine's default pin. */
  element?: HTMLElement
  draggable?: boolean
  anchor?: Anchor
  offset?: [number, number]
}

export function createMarker(map: MapInstance, options: MarkerOptions): Marker {
  return new mapboxgl.Marker({
    element: options.element,
    draggable: options.draggable,
    anchor: options.anchor,
    offset: options.offset,
  })
    .setLngLat(options.lngLat)
    .addTo(map)
}

export interface PopupOptions {
  closeButton?: boolean
  anchor?: Anchor
  offset?: number | [number, number]
  className?: string
  maxWidth?: string
}

/** A popup whose content is `content`, an element the framework renders into. Not on the map yet. */
export function createPopup(options: PopupOptions) {
  const content = document.createElement('div')
  const popup = new mapboxgl.Popup({
    closeButton: options.closeButton ?? true,
    anchor: options.anchor,
    offset: options.offset,
    className: options.className,
    maxWidth: options.maxWidth ?? '20rem',
    focusAfterOpen: false,
  }).setDOMContent(content)
  return { popup, content }
}

export const toLngLat = (lngLat: { lng: number; lat: number }): LngLatTuple => [
  lngLat.lng,
  lngLat.lat,
]

export interface FeatureHandlers {
  click?: (event: FeatureEvent) => void
  enter?: (event: FeatureEvent) => void
  leave?: () => void
}

function featureEvent(event: MapMouseEvent): FeatureEvent | undefined {
  const feature = event.features?.[0]
  return (
    feature && { feature, lngLat: toLngLat(event.lngLat), originalEvent: event }
  )
}

/**
 * Pointer events on a layer's features. `handlers()` is read at event time, so callers pass their latest
 * callbacks without re-binding. The cursor turns into a pointer over clickable features. With
 * `clusterLayerId`, a click on a cluster zooms in until it splits. Returns the function that unbinds.
 */
export function bindFeatureEvents(
  manager: LayerManager,
  layerId: string,
  handlers: () => FeatureHandlers,
  clusterLayerId?: string,
) {
  const { map } = manager
  const setCursor = (cursor: string) => (map.getCanvas().style.cursor = cursor)
  const offs = [
    manager.onLayers([layerId], 'click', (event) => {
      const payload = featureEvent(event)
      if (payload) handlers().click?.(payload)
    }),
    manager.onLayers([layerId], 'mouseenter', (event) => {
      if (handlers().click) setCursor('pointer')
      const payload = featureEvent(event)
      if (payload) handlers().enter?.(payload)
    }),
    manager.onLayers([layerId], 'mouseleave', () => {
      setCursor('')
      handlers().leave?.()
    }),
  ]
  if (clusterLayerId)
    offs.push(
      manager.onLayers([clusterLayerId], 'click', (event) => {
        const feature = event.features?.[0]
        if (feature) zoomToCluster(map, layerId, feature)
      }),
      manager.onLayers([clusterLayerId], 'mouseenter', () =>
        setCursor('pointer'),
      ),
      manager.onLayers([clusterLayerId], 'mouseleave', () => setCursor('')),
    )
  return () => offs.forEach((off) => off())
}

/** Eases to the zoom at which a cluster splits into its children. */
export function zoomToCluster(
  map: MapInstance,
  sourceId: string,
  feature: Feature,
) {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined
  const clusterId = feature.properties?.cluster_id
  if (!source || clusterId === undefined || feature.geometry.type !== 'Point')
    return
  const center = feature.geometry.coordinates as LngLatTuple
  source.getClusterExpansionZoom(clusterId, (error, zoom) => {
    if (!error && zoom != null) map.easeTo({ center, zoom })
  })
}
