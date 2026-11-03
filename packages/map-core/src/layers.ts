import type { GeoJSON } from 'geojson'
import type {
  ExpressionSpecification,
  GeoJSONSourceSpecification,
  RasterSourceSpecification,
} from 'mapbox-gl'
import type {
  GeoJsonLayerSpec,
  GeoJsonLayerType,
  LayerLayout,
  LayerPaint,
  LayerSpecification,
  RasterTileLayerSpec,
} from './types'

// Pure builders: a component's props in, the engine's source and layer specs out. The layer manager then
// adds or updates them. Paint values are plain colours: WebGL paint can't read CSS variables. They are the
// tokens' blue/indigo/purple 9 steps.
const BLUE = '#0090ff'
const INDIGO = '#3e63dd'
const PURPLE = '#8e4ec6'
const WHITE = '#ffffff'

const DEFAULT_PAINT: Record<GeoJsonLayerType, LayerPaint> = {
  circle: {
    'circle-radius': 6,
    'circle-color': BLUE,
    'circle-stroke-width': 1,
    'circle-stroke-color': WHITE,
  },
  line: { 'line-color': BLUE, 'line-width': 2 },
  fill: { 'fill-color': BLUE, 'fill-opacity': 0.3, 'fill-outline-color': BLUE },
  symbol: {},
}

const IS_CLUSTER: ExpressionSpecification = ['has', 'point_count']

/** The ids of a GeoJSON layer's extra layers when clustering. */
export const clusterLayerIds = (id: string) => ({
  clusters: `${id}-clusters`,
  count: `${id}-cluster-count`,
})

const visibility = (visible: boolean | undefined) =>
  visible === false ? 'none' : 'visible'

export function geoJsonSource(
  data: GeoJSON,
  cluster: GeoJsonLayerSpec['cluster'],
): GeoJSONSourceSpecification {
  if (!cluster) return { type: 'geojson', data }
  const options = cluster === true ? {} : cluster
  return {
    type: 'geojson',
    data,
    cluster: true,
    ...(options.radius !== undefined && { clusterRadius: options.radius }),
    ...(options.maxZoom !== undefined && { clusterMaxZoom: options.maxZoom }),
  }
}

/** The layer (or, when clustering, the cluster, count and point layers) drawing a GeoJSON source. */
export function geoJsonLayers(spec: GeoJsonLayerSpec): LayerSpecification[] {
  const { id, type, visible, minzoom, maxzoom } = spec
  const zoom = {
    ...(minzoom !== undefined && { minzoom }),
    ...(maxzoom !== undefined && { maxzoom }),
  }
  const filter = spec.cluster
    ? spec.filter
      ? ['all', ['!', IS_CLUSTER], spec.filter]
      : ['!', IS_CLUSTER]
    : spec.filter
  const main = {
    id,
    type,
    source: id,
    paint: { ...DEFAULT_PAINT[type], ...spec.paint },
    layout: { ...spec.layout, visibility: visibility(visible) } as LayerLayout,
    ...(filter !== undefined && { filter }),
    ...zoom,
  } as LayerSpecification
  if (!spec.cluster) return [main]

  const ids = clusterLayerIds(id)
  return [
    {
      id: ids.clusters,
      type: 'circle',
      source: id,
      filter: IS_CLUSTER,
      layout: { visibility: visibility(visible) },
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          BLUE,
          50,
          INDIGO,
          200,
          PURPLE,
        ],
        'circle-radius': ['step', ['get', 'point_count'], 16, 50, 22, 200, 28],
        'circle-stroke-width': 2,
        'circle-stroke-color': WHITE,
      },
      ...zoom,
    },
    {
      id: ids.count,
      type: 'symbol',
      source: id,
      filter: IS_CLUSTER,
      layout: {
        visibility: visibility(visible),
        'text-field': ['get', 'point_count_abbreviated'],
        'text-size': 12,
        'text-allow-overlap': true,
      },
      paint: { 'text-color': WHITE },
      ...zoom,
    },
    main,
  ]
}

export function rasterTileSource(
  spec: RasterTileLayerSpec,
): RasterSourceSpecification {
  return {
    type: 'raster',
    tiles: spec.tiles,
    tileSize: spec.tileSize ?? 256,
    ...(spec.attribution !== undefined && { attribution: spec.attribution }),
  }
}

export function rasterTileLayer(spec: RasterTileLayerSpec): LayerSpecification {
  return {
    id: spec.id,
    type: 'raster',
    source: spec.id,
    layout: { visibility: visibility(spec.visible) },
    paint: { 'raster-opacity': spec.opacity ?? 1 },
    ...(spec.minzoom !== undefined && { minzoom: spec.minzoom }),
    ...(spec.maxzoom !== undefined && { maxzoom: spec.maxzoom }),
  }
}
