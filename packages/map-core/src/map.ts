import mapboxgl from 'mapbox-gl'
import { LayerManager } from './LayerManager'
import { ensureMapStyles } from './styles'
import type {
  BoundsTuple,
  FitBoundsOptions,
  LngLatTuple,
  MapInstance,
  StyleSpecification,
  ViewState,
} from './types'

export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/standard'

export interface CreateMapOptions {
  accessToken: string
  style?: string | StyleSpecification
  view?: Partial<ViewState>
  bounds?: BoundsTuple
  fitBoundsOptions?: FitBoundsOptions
  interactive?: boolean
}

export interface MapHandle {
  map: MapInstance
  layers: LayerManager
  /** Stops resizing, ends the layer manager (later calls are no-ops), then removes the map. Idempotent. */
  destroy(): void
}

/** Creates a map that fills `container` and follows its size. */
export function createMap(
  container: HTMLElement,
  options: CreateMapOptions,
): MapHandle {
  ensureMapStyles()
  const map = new mapboxgl.Map({
    container,
    accessToken: options.accessToken,
    style: options.style ?? DEFAULT_MAP_STYLE,
    ...options.view,
    bounds: options.bounds,
    fitBoundsOptions: options.fitBoundsOptions,
  })
  if (options.interactive === false) setInteractive(map, false)
  const layers = new LayerManager(map)
  // The parent sets the size; the canvas only follows window resizes on its own.
  const observer = new ResizeObserver(() => map.resize())
  observer.observe(container)

  let destroyed = false
  return {
    map,
    layers,
    destroy() {
      if (destroyed) return
      destroyed = true
      observer.disconnect()
      layers.destroy()
      map.remove()
    },
  }
}

/** Swaps the style; the layer manager re-applies every registered source and layer once it loads. */
// The options type isn't exported, and wrongly requires the font options.
type SetStyleOptions = Parameters<MapInstance['setStyle']>[1]

export function setMapStyle(
  handle: MapHandle,
  style: string | StyleSpecification,
) {
  handle.layers.beginStyleChange()
  // No diffing: the new style replaces everything, so re-applying starts from a known state.
  handle.map.setStyle(style, { diff: false } as SetStyleOptions)
}

export function readView(map: MapInstance): ViewState {
  const { lng, lat } = map.getCenter()
  return {
    center: [lng, lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  }
}

const close = (a: number, b: number, epsilon: number) =>
  Math.abs(a - b) < epsilon

/**
 * Moves the camera to the given parts of `view`, only those that differ from the map's own. A controlled
 * view that echoes back the values from move events is therefore a no-op: no feedback loop.
 */
export function applyView(map: MapInstance, view: Partial<ViewState>) {
  const current = readView(map)
  const changes: Partial<ViewState> = {}
  if (view.center && !sameCenter(view.center, current.center))
    changes.center = view.center
  if (view.zoom !== undefined && !close(view.zoom, current.zoom, 1e-3))
    changes.zoom = view.zoom
  if (view.bearing !== undefined && !close(view.bearing, current.bearing, 1e-2))
    changes.bearing = view.bearing
  if (view.pitch !== undefined && !close(view.pitch, current.pitch, 1e-2))
    changes.pitch = view.pitch
  if (Object.keys(changes).length > 0) map.jumpTo(changes)
}

function sameCenter(a: LngLatTuple, b: LngLatTuple) {
  return close(a[0], b[0], 1e-7) && close(a[1], b[1], 1e-7)
}

export function applyBounds(
  map: MapInstance,
  bounds: BoundsTuple,
  options?: FitBoundsOptions,
) {
  map.fitBounds(bounds, options)
}

const HANDLERS = [
  'boxZoom',
  'scrollZoom',
  'dragPan',
  'dragRotate',
  'keyboard',
  'doubleClickZoom',
  'touchZoomRotate',
  'touchPitch',
] as const

/** Turns every user interaction (pan, zoom, rotate, keyboard) on or off. */
export function setInteractive(map: MapInstance, interactive: boolean) {
  for (const name of HANDLERS) {
    const handler = map[name]
    if (interactive) handler.enable()
    else handler.disable()
  }
}
