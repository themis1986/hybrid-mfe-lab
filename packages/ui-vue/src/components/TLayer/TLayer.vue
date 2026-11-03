<script setup lang="ts">
import {
  bindFeatureEvents,
  type FeatureEvent,
  type LayerSpecification,
} from '@repo/map-core'
import { computed, watch } from 'vue'
import { useListeners, useMapContext } from '../TMapView/context'
import type { TLayerProps } from './types'

// Escape hatch: any layer spec the engine accepts (heatmap, fill-extrusion, a vector source's layer…).
// Renders nothing.
const props = defineProps<TLayerProps>()
const emit = defineEmits<{
  'feature-click': [event: FeatureEvent]
  'feature-enter': [event: FeatureEvent]
  'feature-leave': []
}>()
const hasListener = useListeners()
const { layers } = useMapContext('TLayer')
const owner = {}

const full = computed(
  () => ({ ...props.spec, id: props.id }) as LayerSpecification,
)
const placement = computed(() => ({
  beforeId: props.beforeId,
  slot: props.slot,
}))

watch(
  () => props.id,
  (id, _, onCleanup) => {
    layers.addLayer(owner, full.value, placement.value)
    const unbind = bindFeatureEvents(layers, id, () => ({
      click: hasListener('onFeatureClick')
        ? (event) => emit('feature-click', event)
        : undefined,
      enter: (event) => emit('feature-enter', event),
      leave: () => emit('feature-leave'),
    }))
    onCleanup(() => {
      unbind()
      layers.removeLayer(owner, id)
    })
  },
  { immediate: true },
)

// In-place updates: no-ops when nothing changed (the manager compares).
watch([full, placement], () =>
  layers.updateLayer(owner, full.value, placement.value),
)
</script>

<template><!-- Renders nothing: the map draws it. --></template>
