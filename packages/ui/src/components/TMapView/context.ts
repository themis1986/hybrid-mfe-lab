import type { LayerManager, MapInstance, Marker } from '@repo/map-core'
import { createContext, use, useState } from 'react'

export { useLatest } from '../../lib/latest'

export interface MapContextValue {
  map: MapInstance
  layers: LayerManager
}

// Set by TMapView once its map exists: map children only render inside it.
export const MapContext = createContext<MapContextValue | null>(null)
// Set by TMarker for a popup passed to it.
export const MarkerContext = createContext<Marker | null>(null)

export function useMapContext(component: string): MapContextValue {
  const context = use(MapContext)
  if (!context)
    throw new Error(`<${component}> must be used inside <TMapView>.`)
  return context
}

/** The map of the enclosing TMapView: the escape hatch for anything the components don't cover. */
export function useMap(): MapInstance {
  return useMapContext('useMap').map
}

/** A stable object identifying this component instance to the layer manager. */
export function useOwner() {
  const [owner] = useState(() => ({}))
  return owner
}
