import type { LayerManager, MapInstance, Marker } from '@repo/map-core'
import {
  getCurrentInstance,
  inject,
  type InjectionKey,
  type ShallowRef,
} from 'vue'

export interface MapContextValue {
  map: MapInstance
  layers: LayerManager
}

// Provided by TMapView; its default slot renders only once the map exists, so children read a value.
export const MAP_KEY: InjectionKey<ShallowRef<MapContextValue | null>> =
  Symbol('t-map')
// Provided by TMarker to the popup in its `popup` slot.
export const MARKER_KEY: InjectionKey<ShallowRef<Marker | null>> =
  Symbol('t-map-marker')

export function useMapContext(component: string): MapContextValue {
  const context = inject(MAP_KEY, null)?.value
  if (!context)
    throw new Error(`<${component}> must be used inside <TMapView>.`)
  return context
}

/** The map of the enclosing TMapView: the escape hatch for anything the components don't cover. */
export function useMap(): MapInstance {
  return useMapContext('useMap').map
}

/**
 * Whether the parent listens to an event (`hasListener('onFeatureClick')`): a clickable layer shows a
 * pointer cursor, and unhandled map errors are logged.
 */
export function useListeners() {
  const instance = getCurrentInstance()
  return (name: string) => Boolean(instance?.vnode.props?.[name])
}
