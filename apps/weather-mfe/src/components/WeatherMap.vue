<script setup lang="ts">
import { type MapMouseEvent, TMapView, TMarker } from '@repo/ui-vue/map'
import { computed, useTemplateRef, watch } from 'vue'
import { useColorScheme } from '../hooks/useColorScheme'
import { useWeatherState } from '../hooks/useWeatherState'
import { createPlace, samePlace } from '../lib/place'
import type { Place } from '../types'

// Split from the page and loaded lazily, so the map engine downloads only with it. Each mount counts as one
// billed Mapbox map load (two under StrictMode in dev).
const FLY_ZOOM = 9

const { selected, select } = useWeatherState()
const scheme = useColorScheme()
const map = useTemplateRef<InstanceType<typeof TMapView>>('map')

const token = import.meta.env.VITE_MAPBOX_TOKEN
const mapStyle = computed(() => `mapbox://styles/mapbox/${scheme.value}-v11`)
const lngLat = computed<[number, number]>(() => [
  selected.value.longitude,
  selected.value.latitude,
])
const initialView = { center: lngLat.value, zoom: 6 }

// A click selects a point already in view; only places chosen elsewhere move the camera. Holds the click
// until the watcher below has seen it, so choosing the same point again later (a saved place) still moves.
let clicked: Place | undefined

function onClick(event: MapMouseEvent) {
  // The map also reports clicks on its markers; the marker is already the selected place.
  if ((event.originalEvent.target as Element).closest('[data-weather-marker]'))
    return
  // Past the antimeridian the map reports longitudes beyond ±180, which the API refuses.
  const { lat, lng } = event.lngLat.wrap()
  clicked = createPlace(lat, lng)
  select(clicked)
}

watch(selected, (place) => {
  const fromClick = clicked && samePlace(place, clicked)
  clicked = undefined
  if (fromClick) return
  const engine = map.value?.getMap()
  engine?.flyTo({
    center: [place.longitude, place.latitude],
    zoom: Math.max(engine.getZoom(), FLY_ZOOM),
    // Not `essential`, so the engine skips the animation under prefers-reduced-motion.
    duration: 1600,
  })
})
</script>

<template>
  <TMapView
    ref="map"
    :access-token="token"
    :map-style="mapStyle"
    :initial-view-state="initialView"
    class="cursor-crosshair"
    @click="onClick"
  >
    <TMarker :lng-lat="lngLat">
      <span data-weather-marker class="relative block size-4">
        <span
          class="absolute inset-0 rounded-full bg-accent opacity-50 motion-safe:animate-ping"
        />
        <span
          class="absolute inset-0 box-border rounded-full border-2 border-canvas bg-accent shadow-lg"
        />
      </span>
    </TMarker>
    <template #missing-token>
      <span class="max-w-80">
        Add a Mapbox token to <code>apps/weather-mfe/.env.local</code> to pick
        places on a map. Search and “use my location” work without one.
      </span>
    </template>
  </TMapView>
</template>
