import type {
  ClusterOptions,
  FilterSpecification,
  GeoJSON,
  GeoJsonLayerType,
  LayerLayout,
  LayerPaint,
} from '@repo/map-core'

// Events: status-change (status, error?) for URL data; feature-click and feature-enter (FeatureEvent),
// feature-leave.
export interface TGeoJsonLayerProps {
  /** Unique on the map: the source's id and the layer's (cluster layers add -clusters, -cluster-count). */
  id: string
  /** Inline GeoJSON (a new object is sent to the map again) or a URL. */
  data: GeoJSON | string
  type: GeoJsonLayerType
  paint?: LayerPaint
  layout?: LayerLayout
  /** Expression syntax when clustering. */
  filter?: FilterSpecification
  /** Under this layer (same slot). */
  beforeId?: string
  /** Standard style: 'bottom', 'middle' or 'top'. */
  slot?: string
  visible?: boolean
  /** Point data only: counted clusters; a click on one zooms in. */
  cluster?: boolean | ClusterOptions
  minzoom?: number
  maxzoom?: number
  /** URL data: re-fetches every N milliseconds. */
  refreshInterval?: number
}
