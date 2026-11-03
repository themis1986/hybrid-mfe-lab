import { defineAsyncComponent } from 'vue'
import type { DocEntry, DocProp } from './catalog'

// The map group's entries. One live demo, on TMapView: each map counts as a billed Mapbox map load.
const MapDemo = defineAsyncComponent(() => import('./demos/MapDemo.vue'))

const placementProps: DocProp[] = [
  {
    name: 'before-id',
    type: 'string',
    description: 'Drawn under this layer (same slot).',
  },
  {
    name: 'slot',
    type: "'bottom' | 'middle' | 'top'",
    description:
      'Standard style: where in the basemap. Unset: above everything.',
  },
]
const featureEvents: DocEntry['events'] = [
  {
    name: 'feature-click',
    payload: 'FeatureEvent',
    description:
      '{ feature, lngLat, originalEvent }. A listener shows a pointer cursor.',
  },
  {
    name: 'feature-enter',
    payload: 'FeatureEvent',
    description: 'The pointer entered a feature.',
  },
  {
    name: 'feature-leave',
    payload: '–',
    description: 'The pointer left the features.',
  },
]
const idProp = (what: string): DocProp => ({
  name: 'id',
  type: 'string',
  description: `Required, unique on the map: ${what}. A duplicate is ignored with a warning.`,
})
const visibleProp: DocProp = {
  name: 'visible',
  type: 'boolean',
  default: 'true',
  description: 'Hides the layer without removing it.',
}
export const MAP_ENTRIES: DocEntry[] = [
  {
    id: 'map-view',
    name: 'TMapView',
    group: 'maps',
    summary:
      'A Mapbox GL JS map filling its parent (give the parent a height). Its default slot holds markers, popups and layers; they survive a style change and are removed with the map. Import from @repo/ui-vue/map. Without a token it shows a message instead.',
    props: [
      {
        name: 'access-token',
        type: 'string',
        description:
          'A public Mapbox token. Pass the app’s, e.g. import.meta.env.VITE_MAPBOX_TOKEN.',
      },
      {
        name: 'map-style',
        type: 'string | StyleSpecification',
        default: "'mapbox://styles/mapbox/standard'",
        description: 'Changing it keeps every child layer.',
      },
      {
        name: 'initial-view-state',
        type: 'Partial<ViewState>',
        description: '{ center, zoom, bearing, pitch } at creation.',
      },
      {
        name: 'center / zoom / bearing / pitch',
        type: 'LngLatTuple / number',
        description:
          'Controlled view, with v-model: the map jumps when they change.',
      },
      {
        name: 'bounds',
        type: '[west, south, east, north]',
        description: 'Fitted at creation and whenever it changes.',
      },
      {
        name: 'fit-bounds-options',
        type: 'FitBoundsOptions',
        description: 'Padding, max zoom… for bounds.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        default: 'true',
        description: 'Pan, zoom and rotate by the user.',
      },
      {
        name: 'missing-token-label',
        type: 'string',
        default: '"Set a Mapbox access token to show the map."',
        description: 'The missing-token slot’s default text.',
      },
    ],
    slots: [
      { name: 'default', description: 'Markers, popups and layers.' },
      {
        name: 'missing-token',
        description: 'Shown in place of the map without a token.',
      },
    ],
    events: [
      {
        name: 'load',
        payload: 'MapInstance',
        description: 'The style loaded.',
      },
      { name: 'click', payload: 'MapMouseEvent', description: 'A map click.' },
      {
        name: 'move / moveend',
        payload: 'ViewState',
        description: 'Every camera frame / the end of a movement.',
      },
      {
        name: 'update:center / zoom / bearing / pitch',
        payload: 'LngLatTuple / number',
        description: 'For v-model.',
      },
      {
        name: 'error',
        payload: 'Error',
        description: 'Engine errors; logged when nobody listens.',
      },
    ],
    demo: MapDemo,
    code: `<script setup lang="ts">
import { TGeoJsonLayer, TMapView, TMarker, TPopup } from '@repo/ui-vue/map'
const center = ref<[number, number]>([-9.14, 38.72])
</script>

<template>
  <div class="h-96">
    <TMapView :access-token="token" v-model:center="center" :zoom="5" @error="report">
      <TGeoJsonLayer id="quakes" data="https://example.org/quakes.geojson" type="circle" cluster />
      <TMarker :lng-lat="[-9.14, 38.72]">
        <template #popup><TPopup>Lisbon</TPopup></template>
      </TMarker>
    </TMapView>
  </div>
</template>`,
  },
  {
    id: 'marker',
    name: 'TMarker',
    group: 'maps',
    summary:
      'A DOM marker at a position: the default slot is its content (the default pin without it). For more than a handful of points, use a TGeoJsonLayer.',
    props: [
      { name: 'lng-lat', type: '[lng, lat]', description: 'Its position.' },
      {
        name: 'draggable',
        type: 'boolean',
        default: 'false',
        description: 'dragend reports the drop position.',
      },
      {
        name: 'anchor',
        type: 'Anchor',
        default: "'center'",
        description: 'The part of the marker on the position.',
      },
      { name: 'offset', type: '[x, y]', description: 'Pixels.' },
    ],
    slots: [
      {
        name: 'default',
        description: 'Custom content (decided when the marker mounts).',
      },
      {
        name: 'popup',
        description: 'A TPopup, opened by a click on the marker.',
      },
    ],
    events: [
      { name: 'click', payload: 'MouseEvent', description: 'A click.' },
      {
        name: 'dragend',
        payload: 'LngLatTuple',
        description: 'The drop position.',
      },
    ],
    code: `<TMarker :lng-lat="[-9.14, 38.72]">
  <span class="block size-4 rounded-full bg-accent" />
  <template #popup><TPopup :offset="20">Lisbon</TPopup></template>
</TMarker>`,
  },
  {
    id: 'popup',
    name: 'TPopup',
    group: 'maps',
    summary:
      'A popup at a position, or on a marker in its popup slot. The default slot is its content.',
    props: [
      {
        name: 'lng-lat',
        type: '[lng, lat]',
        description: 'Standalone: where it points.',
      },
      {
        name: 'open',
        type: 'boolean',
        description:
          'Controlled (v-model:open). Unset: a standalone popup is open; a marker’s opens on click.',
      },
      {
        name: 'close-button',
        type: 'boolean',
        default: 'true',
        description: 'The × button.',
      },
      {
        name: 'anchor / offset',
        type: 'Anchor / number | [x, y]',
        description: 'Which side points at the position; distance.',
      },
    ],
    slots: [{ name: 'default', description: 'The content.' }],
    events: [
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'Opened or closed (close button, map click).',
      },
    ],
    code: `<TPopup :lng-lat="[-27.5, 38.5]" v-model:open="open">Azores</TPopup>`,
  },
  {
    id: 'geojson-layer',
    name: 'TGeoJsonLayer',
    group: 'maps',
    summary:
      'GeoJSON drawn by the map: points, lines or polygons, inline or from a URL (with loading, error, abort and refresh), optionally clustered. Prop changes update the layer in place. The way to show many points.',
    props: [
      idProp('the source’s and the layer’s'),
      {
        name: 'data',
        type: 'GeoJSON | string',
        description: 'Inline or a URL.',
      },
      {
        name: 'type',
        type: "'circle' | 'line' | 'fill' | 'symbol'",
        description: 'How features are drawn.',
      },
      {
        name: 'paint / layout / filter',
        type: 'style-spec objects',
        description:
          'Merged over sensible defaults. Filter in expression syntax when clustering.',
      },
      visibleProp,
      {
        name: 'cluster',
        type: 'boolean | { radius, maxZoom }',
        description: 'Counted clusters; a click on one zooms in.',
      },
      {
        name: 'refresh-interval',
        type: 'number',
        description: 'URL data: re-fetch every N ms.',
      },
      ...placementProps,
    ],
    events: [
      {
        name: 'status-change',
        payload: 'status, error?',
        description: "URL data: 'loading' | 'loaded' | 'error'.",
      },
      ...featureEvents,
    ],
    code: `<TGeoJsonLayer
  id="quakes"
  data="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
  type="circle"
  cluster
  :refresh-interval="60_000"
  @status-change="(status, error) => (state = error?.message ?? status)"
  @feature-click="({ feature }) => (picked = feature.properties?.title)"
/>`,
  },
  {
    id: 'raster-tile-layer',
    name: 'TRasterTileLayer',
    group: 'maps',
    summary:
      'Raster tiles from an XYZ URL template: an overlay, or a basemap of your own.',
    props: [
      idProp('the source’s and the layer’s'),
      {
        name: 'tiles',
        type: 'string | string[]',
        description: "'https://…/{z}/{x}/{y}.png'",
      },
      {
        name: 'tile-size',
        type: 'number',
        default: '256',
        description: 'As served.',
      },
      {
        name: 'attribution',
        type: 'string',
        description: 'Credit; most tile servers require it.',
      },
      {
        name: 'opacity',
        type: '0 – 1',
        default: '1',
        description: 'The layer’s opacity.',
      },
      visibleProp,
      ...placementProps,
    ],
    code: `<TRasterTileLayer id="osm" tiles="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" :opacity="0.5" />`,
  },
  {
    id: 'source',
    name: 'TSource',
    parts: ['TLayer'],
    group: 'maps',
    summary:
      'Escape hatches: any source and layer spec the engine accepts (vector tiles, heatmaps, 3D…). Updates still go in place; a layer waits for its source.',
    props: [
      idProp('the source’s (TSource) or the layer’s (TLayer)'),
      {
        name: 'spec',
        type: 'SourceSpecification / TLayerSpec',
        description: 'The raw spec; TLayer’s has no id or slot.',
      },
      ...placementProps,
    ],
    slots: [{ name: 'default', description: 'TSource: its layers, usually.' }],
    events: featureEvents,
    code: `<TSource id="terrain" :spec="{ type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' }">
  <TLayer id="contours" :spec="{ type: 'line', source: 'terrain', 'source-layer': 'contour', paint: { 'line-opacity': 0.4 } }" />
</TSource>`,
  },
]
