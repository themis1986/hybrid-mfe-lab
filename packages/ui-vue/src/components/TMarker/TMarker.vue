<script setup lang="ts">
import {
  createMarker,
  type LngLatTuple,
  type Marker,
  toLngLat,
} from '@repo/map-core'
import { provide, shallowRef, useSlots, watch } from 'vue'
import { MARKER_KEY, useMapContext } from '../TMapView/context'
import type { TMarkerProps } from './types'

// A DOM marker: fine for a handful of interactive points. For many points, use a TGeoJsonLayer (drawn in
// WebGL, clusterable). The default slot is teleported into the marker's element.
const props = withDefaults(defineProps<TMarkerProps>(), { draggable: false })
const emit = defineEmits<{
  click: [event: MouseEvent]
  dragend: [lngLat: LngLatTuple]
}>()
const slots = useSlots()
const { map } = useMapContext('TMarker')
const element = document.createElement('div')
const custom = Boolean(slots.default)
const marker = shallowRef<Marker | null>(null)
provide(MARKER_KEY, marker)

// Created at once (the map exists), so the teleport target is on the page before the first render.
watch(
  () => props.anchor,
  (anchor, _, onCleanup) => {
    const created = createMarker(map, {
      lngLat: props.lngLat,
      element: custom ? element : undefined,
      draggable: props.draggable,
      anchor,
      offset: props.offset,
    })
    created.on('dragend', () => emit('dragend', toLngLat(created.getLngLat())))
    // On the marker's own element, so the default pin reports clicks too.
    const target = created.getElement()
    const click = (event: MouseEvent) => emit('click', event)
    target.addEventListener('click', click)
    marker.value = created
    onCleanup(() => {
      marker.value = null
      target.removeEventListener('click', click)
      created.remove()
    })
  },
  { immediate: true },
)

watch(
  () => [props.lngLat[0], props.lngLat[1]] as LngLatTuple,
  (lngLat) => marker.value?.setLngLat(lngLat),
)
watch(
  () => props.draggable,
  (draggable) => marker.value?.setDraggable(draggable),
)
watch(
  () => [props.offset?.[0] ?? 0, props.offset?.[1] ?? 0] as [number, number],
  (offset) => marker.value?.setOffset(offset),
)
</script>

<template>
  <Teleport v-if="custom" :to="element">
    <div data-slot="marker"><slot /></div>
  </Teleport>
  <slot v-if="marker" name="popup" />
</template>
