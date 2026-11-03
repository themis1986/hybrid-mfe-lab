import type { FeatureCollection, GeoJSON } from 'geojson'
import type {
  GeoJSONSource,
  RasterTileSource,
  VectorTileSource,
} from 'mapbox-gl'
import type {
  LayerPlacement,
  LayerSpecification,
  MapInstance,
  MapMouseEvent,
  SourceSpecification,
} from './types'

/** Who registered an id: only that owner may update or remove it. Any stable object per component. */
export type Owner = object

type LayerEventType = 'click' | 'mouseenter' | 'mouseleave'

interface SourceEntry {
  owner: Owner
  spec: SourceSpecification
}

interface LayerEntry {
  owner: Owner
  spec: LayerSpecification
  placement: LayerPlacement
}

interface LiveSourceKeys {
  data?: GeoJSON | string
  tiles?: string[]
  url?: string
}

// Keys a source can change in place (setData, setTiles, setUrl); any other change re-creates it.
const LIVE_SOURCE_KEYS = new Set(['data', 'tiles', 'url'])

const same = (a: unknown, b: unknown) =>
  a === b || JSON.stringify(a) === JSON.stringify(b)

function structureOf(spec: object) {
  return Object.fromEntries(
    Object.entries(spec).filter(([key]) => !LIVE_SOURCE_KEYS.has(key)),
  )
}

/**
 * The one place that touches a map's sources and layers. Components register what they want (the
 * registry, in insertion order); the manager applies it whenever the style is ready, re-applies all of it
 * after a style change (`setStyle` drops custom sources and layers), and turns prop changes into the
 * targeted update calls (setData, setPaintProperty, setLayoutProperty, setFilter…) instead of removing and
 * re-adding. A layer whose source isn't there yet waits for it. After `destroy()`, every call is a no-op,
 * so components unmounting after their map are safe.
 */
export class LayerManager {
  readonly map: MapInstance
  private readonly sources = new Map<string, SourceEntry>()
  private readonly layers = new Map<string, LayerEntry>()
  private readonly warned = new Set<string>()
  private ready: boolean
  private destroyed = false

  constructor(map: MapInstance) {
    this.map = map
    this.ready = map.isStyleLoaded()
    map.on('style.load', this.onStyleLoad)
  }

  /** Call before `map.setStyle`: until the new style loads, changes are only recorded. */
  beginStyleChange() {
    this.ready = false
  }

  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    this.map.off('style.load', this.onStyleLoad)
    this.sources.clear()
    this.layers.clear()
  }

  // Sources

  addSource(owner: Owner, id: string, spec: SourceSpecification): boolean {
    if (this.destroyed) return false
    if (this.sources.has(id) || (this.ready && this.map.getSource(id))) {
      this.warnDuplicate('source', id)
      return false
    }
    this.sources.set(id, { owner, spec })
    if (this.ready) {
      this.map.addSource(id, spec)
      this.applyWaitingLayers(id)
    }
    return true
  }

  updateSource(owner: Owner, id: string, spec: SourceSpecification) {
    const entry = this.owned(this.sources, owner, id)
    if (!entry) return
    const previous = entry.spec
    entry.spec = spec
    if (!this.ready || !this.map.getSource(id)) return

    if (!same(structureOf(previous), structureOf(spec))) {
      // Clustering, tile size and the like can't change in place: re-create the source and its layers.
      const dependents = this.layersOf(id)
      dependents.forEach((layerId) => this.map.removeLayer(layerId))
      this.map.removeSource(id)
      this.map.addSource(id, spec)
      this.applyWaitingLayers(id)
      return
    }
    const source = this.map.getSource(id)
    const next = spec as LiveSourceKeys
    const before = previous as LiveSourceKeys
    if (next.data !== before.data)
      (source as GeoJSONSource).setData(next.data ?? EMPTY)
    if (next.tiles && !same(next.tiles, before.tiles))
      (source as RasterTileSource | VectorTileSource).setTiles(next.tiles)
    if (next.url && next.url !== before.url)
      (source as RasterTileSource | VectorTileSource).setUrl(next.url)
  }

  /** Removes the source; layers that use it are taken off the map first and wait for it to come back. */
  removeSource(owner: Owner, id: string) {
    if (!this.owned(this.sources, owner, id)) return
    this.sources.delete(id)
    if (!this.ready || !this.map.getSource(id)) return
    this.layersOf(id).forEach((layerId) => this.map.removeLayer(layerId))
    this.map.removeSource(id)
  }

  // Layers

  addLayer(
    owner: Owner,
    spec: LayerSpecification,
    placement: LayerPlacement = {},
  ): boolean {
    if (this.destroyed) return false
    if (
      this.layers.has(spec.id) ||
      (this.ready && this.map.getLayer(spec.id))
    ) {
      this.warnDuplicate('layer', spec.id)
      return false
    }
    this.layers.set(spec.id, { owner, spec, placement })
    if (this.ready) this.placeLayer(spec.id)
    return true
  }

  updateLayer(
    owner: Owner,
    spec: LayerSpecification,
    placement: LayerPlacement = {},
  ) {
    const entry = this.owned(this.layers, owner, spec.id)
    if (!entry) return
    const previous = entry.spec
    const previousPlacement = entry.placement
    entry.spec = spec
    entry.placement = placement
    if (!this.ready) return
    const { map } = this
    const id = spec.id
    if (!map.getLayer(id)) {
      this.placeLayer(id)
      return
    }

    if (spec.type !== previous.type || sourceOf(spec) !== sourceOf(previous)) {
      map.removeLayer(id)
      this.placeLayer(id)
      return
    }
    diffProperties(previous.paint, spec.paint, (key, value) =>
      map.setPaintProperty(id, key as never, value as never),
    )
    diffProperties(previous.layout, spec.layout, (key, value) =>
      map.setLayoutProperty(id, key as never, value as never),
    )
    if (!same(previous.filter, spec.filter))
      map.setFilter(id, spec.filter ?? null)
    if (previous.minzoom !== spec.minzoom || previous.maxzoom !== spec.maxzoom)
      map.setLayerZoomRange(id, spec.minzoom ?? 0, spec.maxzoom ?? 24)
    if (previousPlacement.slot !== placement.slot)
      map.setSlot(id, placement.slot ?? null)
    if (previousPlacement.beforeId !== placement.beforeId)
      map.moveLayer(id, this.existingBeforeId(placement))
  }

  removeLayer(owner: Owner, id: string) {
    if (!this.owned(this.layers, owner, id)) return
    this.layers.delete(id)
    if (this.ready && this.map.getLayer(id)) this.map.removeLayer(id)
  }

  /**
   * Listens to pointer events on the given layers (missing layers are skipped). Returns the function that
   * stops listening, safe to call after the map is gone.
   */
  onLayers(
    layerIds: string[],
    type: LayerEventType,
    listener: (event: MapMouseEvent) => void,
  ): () => void {
    if (this.destroyed) return () => {}
    this.map.on(type, layerIds, listener)
    return () => {
      if (!this.destroyed) this.map.off(type, layerIds, listener)
    }
  }

  // Internals

  private onStyleLoad = () => {
    if (this.destroyed) return
    this.ready = true
    // getSource/getLayer guards keep this idempotent if the style kept anything.
    for (const [id, { spec }] of this.sources)
      if (!this.map.getSource(id)) this.map.addSource(id, spec)
    for (const id of this.layers.keys()) this.placeLayer(id)
    // A beforeId may name a layer registered later: order once everything is on the map.
    for (const [id, { placement }] of this.layers)
      if (
        placement.beforeId &&
        this.map.getLayer(id) &&
        this.map.getLayer(placement.beforeId)
      )
        this.map.moveLayer(id, placement.beforeId)
  }

  /** Adds the layer if its source is on the map; otherwise it waits (see applyWaitingLayers). */
  private placeLayer(id: string) {
    const entry = this.layers.get(id)
    if (!entry || this.map.getLayer(id)) return
    const source = sourceOf(entry.spec)
    if (source && !this.map.getSource(source)) return
    const spec = entry.placement.slot
      ? { ...entry.spec, slot: entry.placement.slot }
      : entry.spec
    this.map.addLayer(spec, this.existingBeforeId(entry.placement))
  }

  private applyWaitingLayers(sourceId: string) {
    for (const [id, { spec }] of this.layers)
      if (sourceOf(spec) === sourceId) this.placeLayer(id)
  }

  private layersOf(sourceId: string) {
    return [...this.layers.values()]
      .filter(
        ({ spec }) => sourceOf(spec) === sourceId && this.map.getLayer(spec.id),
      )
      .map(({ spec }) => spec.id)
  }

  private existingBeforeId({ beforeId }: LayerPlacement) {
    return beforeId && this.map.getLayer(beforeId) ? beforeId : undefined
  }

  private owned<T extends { owner: Owner }>(
    registry: Map<string, T>,
    owner: Owner,
    id: string,
  ) {
    if (this.destroyed) return undefined
    const entry = registry.get(id)
    return entry?.owner === owner ? entry : undefined
  }

  private warnDuplicate(kind: 'source' | 'layer', id: string) {
    const key = `${kind}:${id}`
    if (this.warned.has(key)) return
    this.warned.add(key)
    console.warn(
      `[map] A ${kind} with id "${id}" is already on this map; this one is ignored. Ids must be unique.`,
    )
  }
}

const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] }

function sourceOf(spec: LayerSpecification): string | undefined {
  return 'source' in spec && typeof spec.source === 'string'
    ? spec.source
    : undefined
}

/** Calls `set` for every key whose value changed; a removed key is set to undefined (its default). */
function diffProperties(
  previous: object | undefined,
  next: object | undefined,
  set: (key: string, value: unknown) => void,
) {
  const before = (previous ?? {}) as Record<string, unknown>
  const after = (next ?? {}) as Record<string, unknown>
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)]))
    if (!same(before[key], after[key])) set(key, after[key])
}
