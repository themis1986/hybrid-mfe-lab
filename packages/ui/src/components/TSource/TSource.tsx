import { useEffect } from 'react'
import { useLatest, useMapContext, useOwner } from '../TMapView/context'
import type { TSourceProps } from './types'

// Escape hatch: any source spec the engine accepts. Draw it with TLayer.
export function TSource({ id, spec, children }: TSourceProps) {
  const { layers } = useMapContext('TSource')
  const owner = useOwner()
  const latest = useLatest(spec)

  // Child layers register first (React runs children's effects before their parent's); the manager keeps
  // them waiting until this source is on the map.
  useEffect(() => {
    layers.addSource(owner, id, latest.current)
    return () => layers.removeSource(owner, id)
  }, [layers, owner, id, latest])

  useEffect(() => {
    layers.updateSource(owner, id, spec)
  }, [layers, owner, id, spec])

  return children
}
