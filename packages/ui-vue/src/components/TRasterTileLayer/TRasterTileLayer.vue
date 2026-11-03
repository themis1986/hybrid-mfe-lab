<script setup lang="ts">
import {
  rasterTileLayer,
  type RasterTileLayerSpec,
  rasterTileSource,
} from '@repo/map-core'
import { computed, watch } from 'vue'
import { useMapContext } from '../TMapView/context'
import type { TRasterTileLayerProps } from './types'

// Raster tiles from an XYZ URL template (an overlay, or a basemap of your own). Renders nothing.
const props = withDefaults(defineProps<TRasterTileLayerProps>(), {
  visible: true,
})
const { layers } = useMapContext('TRasterTileLayer')
const owner = {}

const spec = computed<RasterTileLayerSpec>(() => ({
  id: props.id,
  tiles: typeof props.tiles === 'string' ? [props.tiles] : props.tiles,
  tileSize: props.tileSize,
  attribution: props.attribution,
  opacity: props.opacity,
  visible: props.visible,
  minzoom: props.minzoom,
  maxzoom: props.maxzoom,
}))
const placement = computed(() => ({
  beforeId: props.beforeId,
  slot: props.slot,
}))

watch(
  () => props.id,
  (id, _, onCleanup) => {
    layers.addSource(owner, id, rasterTileSource(spec.value))
    layers.addLayer(owner, rasterTileLayer(spec.value), placement.value)
    onCleanup(() => {
      layers.removeLayer(owner, id)
      layers.removeSource(owner, id)
    })
  },
  { immediate: true },
)

// In-place updates: no-ops when nothing changed (the manager compares).
watch([spec, placement], () => {
  layers.updateSource(owner, props.id, rasterTileSource(spec.value))
  layers.updateLayer(owner, rasterTileLayer(spec.value), placement.value)
})
</script>

<template><!-- Renders nothing: the map draws it. --></template>
