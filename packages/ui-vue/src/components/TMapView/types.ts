import type {
  BoundsTuple,
  FitBoundsOptions,
  LngLatTuple,
  StyleSpecification,
  ViewState,
} from '@repo/map-core'

// Events: load (map), click (MapMouseEvent), move and moveend (ViewState), error (Error; logged when
// nobody listens), and update:center/zoom/bearing/pitch for v-model.
export interface TMapViewProps {
  /** A public Mapbox token. Apps pass theirs, e.g. `import.meta.env.VITE_MAPBOX_TOKEN`. Without one, the missing-token slot shows instead. */
  accessToken?: string
  /** A style URL or object. Changing it keeps every source and layer of the map's children. */
  mapStyle?: string | StyleSpecification
  /** The first view, when the view is uncontrolled. */
  initialViewState?: Partial<ViewState>
  /** Controlled view (v-model:center, v-model:zoom…): the map jumps here when the value changes. */
  center?: LngLatTuple
  zoom?: number
  bearing?: number
  pitch?: number
  /** [west, south, east, north]: fitted at creation and whenever it changes. */
  bounds?: BoundsTuple
  fitBoundsOptions?: FitBoundsOptions
  /** Pan, zoom and rotate by the user. */
  interactive?: boolean
  /** The missing-token slot's default text. */
  missingTokenLabel?: string
}
