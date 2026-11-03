import type { GeoJSON } from 'geojson'
import type {
  CircleLayout,
  CirclePaint,
  FillLayout,
  FillPaint,
  FilterSpecification,
  GeoJSONFeature,
  LineLayout,
  LinePaint,
  Map as MapboxMap,
  MapMouseEvent,
  SymbolLayout,
  SymbolPaint,
} from 'mapbox-gl'

export type {
  FilterSpecification,
  GeoJSONFeature,
  LayerSpecification,
  MapMouseEvent,
  SourceSpecification,
  StyleSpecification,
} from 'mapbox-gl'
export type { GeoJSON } from 'geojson'

/** The engine's map object: the escape hatch for anything the components don't cover. */
export type MapInstance = MapboxMap

/** [longitude, latitude]. */
export type LngLatTuple = [number, number]

/** [west, south, east, north]. */
export type BoundsTuple = [number, number, number, number]

/** The camera: where the map looks and how. */
export interface ViewState {
  center: LngLatTuple
  zoom: number
  bearing: number
  pitch: number
}

export type FitBoundsOptions = Parameters<MapboxMap['fitBounds']>[1]

/**
 * Where a layer goes in the style's layer stack. `slot` ('bottom' | 'middle' | 'top') places it in the
 * Standard style's basemap; `beforeId` puts it under another layer of the same slot.
 */
export interface LayerPlacement {
  beforeId?: string
  slot?: string
}

export type GeoJsonLayerType = 'circle' | 'line' | 'fill' | 'symbol'
export type LayerPaint = CirclePaint | LinePaint | FillPaint | SymbolPaint
export type LayerLayout = CircleLayout | LineLayout | FillLayout | SymbolLayout

export interface ClusterOptions {
  /** Cluster radius in pixels (default 50). */
  radius?: number
  /** The last zoom level at which points are clustered. */
  maxZoom?: number
}

/** A GeoJSON layer's look; its data is passed separately (it may still be loading). */
export interface GeoJsonLayerSpec {
  id: string
  type: GeoJsonLayerType
  paint?: LayerPaint
  layout?: LayerLayout
  /** Expression syntax when clustering: it is combined with the "not a cluster" filter. */
  filter?: FilterSpecification
  visible?: boolean
  /** Point data only: groups nearby points into counted clusters. */
  cluster?: boolean | ClusterOptions
  minzoom?: number
  maxzoom?: number
}

export interface RasterTileLayerSpec {
  id: string
  /** XYZ URL templates, e.g. 'https://tile.example.org/{z}/{x}/{y}.png'. */
  tiles: string[]
  /** 256 (default) or 512. */
  tileSize?: number
  /** Shown in the map's attribution control. */
  attribution?: string
  /** 0 to 1. */
  opacity?: number
  visible?: boolean
  minzoom?: number
  maxzoom?: number
}

/** A remote GeoJSON request's state. */
export type GeoJsonStatus = 'idle' | 'loading' | 'loaded' | 'error'

export interface GeoJsonLoadState {
  status: GeoJsonStatus
  /** The last data loaded; kept while a refresh is in flight or after it failed. */
  data?: GeoJSON
  error?: Error
}

/** A pointer event on a layer's feature. */
export interface FeatureEvent {
  feature: GeoJSONFeature
  lngLat: LngLatTuple
  originalEvent: MapMouseEvent
}
