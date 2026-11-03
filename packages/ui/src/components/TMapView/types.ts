import type {
  BoundsTuple,
  FitBoundsOptions,
  LngLatTuple,
  MapInstance,
  MapMouseEvent,
  StyleSpecification,
  ViewState,
} from '@repo/map-core'
import type { CSSProperties, ReactNode, Ref } from 'react'

export interface TMapViewHandle {
  /** The engine's map, or null before it is created (or without a token). */
  getMap(): MapInstance | null
}

export interface TMapViewProps {
  /** A public Mapbox token. Apps pass theirs, e.g. `import.meta.env.VITE_MAPBOX_TOKEN`. Without one, `missingTokenLabel` shows instead. */
  accessToken?: string
  /** A style URL or object. Changing it keeps every source and layer of the map's children. */
  mapStyle?: string | StyleSpecification
  /** The first view, when the view is uncontrolled. */
  initialViewState?: Partial<ViewState>
  /** Controlled view: the map jumps here when the value changes. Pass back what `onMove` gives. */
  center?: LngLatTuple
  zoom?: number
  bearing?: number
  pitch?: number
  /** [west, south, east, north]: fitted at creation and whenever it changes. */
  bounds?: BoundsTuple
  fitBoundsOptions?: FitBoundsOptions
  /** Pan, zoom and rotate by the user. */
  interactive?: boolean
  /** Shown in the map's place when there is no token. */
  missingTokenLabel?: string
  /** The style has loaded. */
  onLoad?: (map: MapInstance) => void
  onClick?: (event: MapMouseEvent) => void
  /** On every camera frame (user or code). */
  onMove?: (view: ViewState) => void
  onMoveEnd?: (view: ViewState) => void
  /** Engine errors (style, tiles, token). Without a handler they are logged. */
  onError?: (error: Error) => void
  ref?: Ref<TMapViewHandle>
  className?: string
  style?: CSSProperties
  /** Markers, popups and layers. */
  children?: ReactNode
}
