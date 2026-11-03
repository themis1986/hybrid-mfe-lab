import type { LayerManager, MapInstance, Marker } from '@repo/map-core'
import { inject, type InjectionKey, type ShallowRef } from 'vue'

export { useListeners } from '../../lib/listeners'

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
