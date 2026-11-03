<script setup lang="ts">
import { TButton, TCluster, TStack } from '@repo/ui-vue'
import {
  type FeatureEvent,
  type GeoJsonStatus,
  type LngLatTuple,
  TGeoJsonLayer,
  TMapView,
  TMarker,
  TPopup,
  TRasterTileLayer,
} from '@repo/ui-vue/map'
import { reactive, ref, useTemplateRef } from 'vue'
import {
  azores,
  crossing,
  earthquakesUrl,
  iberia,
  initialView,
  mapStyles,
  osmAttribution,
  osmTiles,
  places,
} from './mapData'

// The map demo: loaded on its own (defineAsyncComponent), so the map engine downloads only with it.
type LayerName = 'polygon' | 'line' | 'quakes' | 'tiles'

const map = useTemplateRef<InstanceType<typeof TMapView>>('map')
const token = import.meta.env.VITE_MAPBOX_TOKEN
const style = ref<keyof typeof mapStyles>('standard')
const shown = reactive<Record<LayerName, boolean>>({
  polygon: true,
  line: true,
  quakes: true,
  tiles: false,
})
const status = ref('idle')
const picked = ref<string>()

const lineStyle = { 'line-width': 3, 'line-dasharray': [2, 1] }

function onStatus(next: GeoJsonStatus, error?: Error) {
  status.value = error ? `${next}: ${error.message}` : next
}
function onQuake({ feature }: FeatureEvent) {
  picked.value = String(feature.properties?.title ?? feature.id)
}
function onDrop([lng, lat]: LngLatTuple) {
  picked.value = `Reykjavik dropped at ${lng.toFixed(2)}, ${lat.toFixed(2)}`
}
// The escape hatch: the engine's map, here to list what is on it.
function logLayers() {
  console.info(
    map.value
      ?.getMap()
      ?.getStyle()
      ?.layers.map((layer) => layer.id),
  )
}
</script>

<template>
  <TStack :gap="3">
    <TCluster :gap="2">
      <TButton
        v-for="(on, name) in shown"
        :key="name"
        size="sm"
        :variant="on ? 'soft' : 'outline'"
        :aria-pressed="on"
        @click="shown[name] = !on"
      >
        {{ name }}
      </TButton>
      <TButton
        size="sm"
        variant="outline"
        @click="style = style === 'standard' ? 'light' : 'standard'"
      >
        Style: {{ style }}
      </TButton>
      <TButton size="sm" variant="ghost" @click="logLayers">Log layers</TButton>
    </TCluster>

    <div class="h-96">
      <TMapView
        ref="map"
        :access-token="token"
        :map-style="mapStyles[style]"
        :initial-view-state="initialView"
        class="rounded-md"
      >
        <TRasterTileLayer
          id="osm"
          :tiles="osmTiles"
          :attribution="osmAttribution"
          :opacity="0.5"
          :visible="shown.tiles"
        />
        <TGeoJsonLayer
          id="iberia"
          :data="iberia"
          type="fill"
          :visible="shown.polygon"
        />
        <TGeoJsonLayer
          id="crossing"
          :data="crossing"
          type="line"
          :paint="lineStyle"
          :visible="shown.line"
        />
        <TGeoJsonLayer
          id="quakes"
          :data="earthquakesUrl"
          type="circle"
          cluster
          :refresh-interval="60_000"
          :visible="shown.quakes"
          @status-change="onStatus"
          @feature-click="onQuake"
        />

        <TMarker :lng-lat="places[0].lngLat">
          <span
            class="block size-4 cursor-pointer rounded-full border-2 border-canvas bg-accent shadow-sm"
          />
          <template #popup>
            <TPopup :offset="20">Lisbon: a custom marker.</TPopup>
          </template>
        </TMarker>
        <TMarker :lng-lat="places[1].lngLat">
          <template #popup>
            <TPopup :offset="36">New York: the default pin.</TPopup>
          </template>
        </TMarker>
        <TMarker :lng-lat="places[2].lngLat" draggable @dragend="onDrop" />
        <TPopup :lng-lat="azores" :close-button="false">Azores</TPopup>
      </TMapView>
    </div>

    <p class="m-0 text-sm text-fg-muted">
      Earthquakes: {{ status
      }}<template v-if="picked"> · {{ picked }}</template>
    </p>
  </TStack>
</template>
