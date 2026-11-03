// The map engine's framework-agnostic layer: types, the layer manager, spec builders, overlays and the
// GeoJSON loader. @repo/ui/map and @repo/ui-vue/map build their components on it; no React or Vue here.
export { LayerManager } from './LayerManager'
export type { Owner } from './LayerManager'
export {
  applyBounds,
  applyView,
  createMap,
  DEFAULT_MAP_STYLE,
  readView,
  setInteractive,
  setMapStyle,
} from './map'
export type { CreateMapOptions, MapHandle } from './map'
export {
  clusterLayerIds,
  geoJsonLayers,
  geoJsonSource,
  rasterTileLayer,
  rasterTileSource,
} from './layers'
export {
  bindFeatureEvents,
  createMarker,
  createPopup,
  toLngLat,
  zoomToCluster,
} from './overlays'
export type {
  Anchor,
  FeatureHandlers,
  Marker,
  MarkerOptions,
  Popup,
  PopupOptions,
} from './overlays'
export { createGeoJsonLoader } from './geojsonLoader'
export type { GeoJsonLoader, GeoJsonLoadOptions } from './geojsonLoader'
export { ensureMapStyles } from './styles'
export type * from './types'
