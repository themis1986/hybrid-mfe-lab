<script setup lang="ts">
import {
  bindFeatureEvents,
  clusterLayerIds,
  createGeoJsonLoader,
  type FeatureEvent,
  type GeoJSON,
  geoJsonLayers,
  type GeoJsonLayerSpec,
  geoJsonSource,
  type GeoJsonStatus,
} from '@repo/map-core'
import { computed, shallowRef, watch } from 'vue'
import { useListeners, useMapContext } from '../TMapView/context'
import type { TGeoJsonLayerProps } from './types'

// GeoJSON drawn in WebGL: points (optionally clustered), lines or polygons, from inline data or a URL. The
// map's layer manager adds it once and turns later prop changes into in-place updates. Renders nothing.
const props = withDefaults(defineProps<TGeoJsonLayerProps>(), {
  visible: true,
  cluster: false,
})
const emit = defineEmits<{
  'status-change': [status: GeoJsonStatus, error?: Error]
  'feature-click': [event: FeatureEvent]
  'feature-enter': [event: FeatureEvent]
  'feature-leave': []
}>()
const hasListener = useListeners()
const { layers } = useMapContext('TGeoJsonLayer')
const owner = {}

const EMPTY: GeoJSON = { type: 'FeatureCollection', features: [] }
const url = computed(() =>
  typeof props.data === 'string' ? props.data : undefined,
)
const remote = shallowRef<GeoJSON>()
const geojson = computed(() =>
  typeof props.data === 'string' ? (remote.value ?? EMPTY) : props.data,
)
const spec = computed<GeoJsonLayerSpec>(() => ({
  id: props.id,
  type: props.type,
  paint: props.paint,
  layout: props.layout,
  filter: props.filter,
  visible: props.visible,
  cluster: props.cluster,
  minzoom: props.minzoom,
  maxzoom: props.maxzoom,
}))
const placement = computed(() => ({
  beforeId: props.beforeId,
  slot: props.slot,
}))

// Added once per id (and clustering on/off, which changes the set of layers); removed on unmount.
watch(
  () => [props.id, Boolean(props.cluster)] as const,
  ([id, clustered], _, onCleanup) => {
    const specs = geoJsonLayers(spec.value)
    layers.addSource(owner, id, geoJsonSource(geojson.value, props.cluster))
    specs.forEach((layer) => layers.addLayer(owner, layer, placement.value))
    const unbind = bindFeatureEvents(
      layers,
      id,
      () => ({
        click: hasListener('onFeatureClick')
          ? (event) => emit('feature-click', event)
          : undefined,
        enter: (event) => emit('feature-enter', event),
        leave: () => emit('feature-leave'),
      }),
      clustered ? clusterLayerIds(id).clusters : undefined,
    )
    onCleanup(() => {
      unbind()
      specs.forEach((layer) => layers.removeLayer(owner, layer.id))
      layers.removeSource(owner, id)
    })
  },
  { immediate: true },
)

// In-place updates: no-ops when nothing changed (the manager compares).
watch([geojson, () => JSON.stringify(props.cluster)], () =>
  layers.updateSource(
    owner,
    props.id,
    geoJsonSource(geojson.value, props.cluster),
  ),
)
watch([spec, placement], () =>
  geoJsonLayers(spec.value).forEach((layer) =>
    layers.updateLayer(owner, layer, placement.value),
  ),
)

// URL data: fetched here, aborted when the URL changes or the layer unmounts.
watch(
  () => [url.value, props.refreshInterval] as const,
  ([current, refreshInterval], _, onCleanup) => {
    if (!current) return
    const loader = createGeoJsonLoader((state) => {
      remote.value = state.data
      emit('status-change', state.status, state.error)
    })
    loader.load(current, { refreshInterval })
    onCleanup(() => loader.dispose())
  },
  { immediate: true },
)
</script>

<template><!-- Renders nothing: the map draws it. --></template>
