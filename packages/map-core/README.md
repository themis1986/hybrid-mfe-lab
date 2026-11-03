# Maps: `@repo/map-core`, `@repo/ui/map`, `@repo/ui-vue/map`

Declarative Mapbox GL JS maps for both component libraries. The components are the same in React and Vue:

| Component          | What it does                                                                         |
| ------------------ | ------------------------------------------------------------------------------------ |
| `TMapView`         | The map. Fills its parent; its children are the components below.                    |
| `TMarker`          | A DOM marker with custom content, dragging and a popup.                              |
| `TPopup`           | A popup at a position, or on a marker.                                               |
| `TGeoJsonLayer`    | GeoJSON (inline or a URL) as circles, lines, fills or symbols, optionally clustered. |
| `TRasterTileLayer` | Raster tiles from an XYZ URL template.                                               |
| `TSource`/`TLayer` | Any raw source and layer spec: vector tiles, heatmaps, 3D, and so on.                |

`@repo/map-core` is the framework-agnostic part both libraries build on:

- the types;
- `LayerManager`, the only code that adds, updates and removes sources and layers;
- the spec builders, the marker and popup factories, and the remote GeoJSON loader;
- the engine's CSS, injected at runtime.

It imports no React or Vue. Apps don't import it: the libraries re-export what they need.

The choices behind it are recorded in [documents/decisions/map.md](../../documents/decisions/map.md).

## Token, license and cost

- **The token is passed in.** Mapbox GL JS needs a public access token (`pk.…`). Libraries can't read env
  variables (Vite's library mode bakes them in at the library's build), so each app reads its own and passes
  it to `TMapView`:

  ```sh
  cp apps/ui-react-docs/.env.example apps/ui-react-docs/.env.local   # then set VITE_MAPBOX_TOKEN=
  cp apps/ui-vue-docs/.env.example apps/ui-vue-docs/.env.local
  ```

  A remote's own `.env.local` is what counts, also when the shell hosts it, because the value is inlined
  into that remote's bundle at build time.
  - `.env` and `.env.*` are git-ignored; only `.env.example` files are committed.
  - `VITE_MAPBOX_TOKEN` is in the root `turbo.json` `build.env`, so changing it invalidates the cached build.

- **No token:** `TMapView` shows a message in place of the map (`missingTokenLabel`, or the `missing-token`
  slot in Vue) and creates no map.
- **The token ships to the browser.** Use a public token with URL restrictions (Mapbox console → Tokens),
  never a secret one. Don't log it.
- **License:** Mapbox GL JS v2+ is proprietary (Mapbox Terms of Service), not open source. Using it requires a
  Mapbox account and agreeing to those terms.
- **Cost:** usage is billed per _map load_: each map object created, with a monthly free tier. React
  StrictMode creates each map twice in dev.

## Usage

Give the map's parent a size. Keep inline GeoJSON at module level (or memoized): a new object is sent to the
map again.

### React

```tsx
import {
  TGeoJsonLayer,
  TLayer,
  TMapView,
  TMarker,
  TPopup,
  TRasterTileLayer,
  TSource,
  type TMapViewHandle,
  type ViewState,
} from '@repo/ui/map'

const route = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-9.14, 38.72],
      [-74.01, 40.71],
    ],
  },
}

function Map() {
  const ref = useRef<TMapViewHandle>(null) // ref.current?.getMap(): the engine's map
  const [view, setView] = useState<ViewState>() // optional: a controlled camera
  const [status, setStatus] = useState('idle')

  return (
    <div className="h-96">
      <TMapView
        ref={ref}
        accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/standard"
        initialViewState={{ center: [-20, 40], zoom: 2 }}
        onMove={setView}
        onError={(error) => report(error)}
      >
        <TRasterTileLayer
          id="osm"
          tiles="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
          opacity={0.5}
        />
        <TGeoJsonLayer
          id="route"
          data={route}
          type="line"
          paint={{ 'line-width': 3 }}
          slot="middle"
        />
        <TGeoJsonLayer
          id="quakes"
          data="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
          type="circle"
          cluster={{ radius: 40 }}
          refreshInterval={60_000}
          onStatusChange={(next, error) => setStatus(error?.message ?? next)}
          onFeatureClick={({ feature }) => console.info(feature.properties)}
        />
        <TSource
          id="terrain"
          spec={{ type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' }}
        >
          <TLayer
            id="contours"
            spec={{
              type: 'line',
              source: 'terrain',
              'source-layer': 'contour',
            }}
          />
        </TSource>
        <TMarker
          lngLat={[-9.14, 38.72]}
          popup={<TPopup offset={20}>Lisbon</TPopup>}
        >
          <span className="block size-4 rounded-full bg-accent" />
        </TMarker>
        <TMarker
          lngLat={[-21.94, 64.15]}
          draggable
          onDragEnd={(lngLat) => save(lngLat)}
        />
        <TPopup lngLat={[-27.5, 38.5]}>Azores</TPopup>
      </TMapView>
    </div>
  )
}
```

`useMap()` gives the engine's map to any component inside `TMapView`.

### Vue

```vue
<script setup lang="ts">
import {
  TGeoJsonLayer,
  TLayer,
  TMapView,
  TMarker,
  TPopup,
  TRasterTileLayer,
  TSource,
  type LngLatTuple,
} from '@repo/ui-vue/map'
import { route } from './data' // module-level GeoJSON

const map = useTemplateRef<InstanceType<typeof TMapView>>('map') // map.value?.getMap()
const center = ref<LngLatTuple>([-20, 40]) // v-model:center, v-model:zoom… (optional)
const status = ref('idle')
</script>

<template>
  <div class="h-96">
    <TMapView
      ref="map"
      :access-token="token"
      v-model:center="center"
      :zoom="2"
      @error="report"
    >
      <TRasterTileLayer
        id="osm"
        tiles="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
        :opacity="0.5"
      />
      <TGeoJsonLayer
        id="route"
        :data="route"
        type="line"
        :paint="{ 'line-width': 3 }"
        slot="middle"
      />
      <TGeoJsonLayer
        id="quakes"
        data="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
        type="circle"
        :cluster="{ radius: 40 }"
        :refresh-interval="60_000"
        @status-change="(next, error) => (status = error?.message ?? next)"
        @feature-click="({ feature }) => console.info(feature.properties)"
      />
      <TSource
        id="terrain"
        :spec="{ type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' }"
      >
        <TLayer
          id="contours"
          :spec="{ type: 'line', source: 'terrain', 'source-layer': 'contour' }"
        />
      </TSource>
      <TMarker :lng-lat="[-9.14, 38.72]">
        <span class="block size-4 rounded-full bg-accent" />
        <template #popup><TPopup :offset="20">Lisbon</TPopup></template>
      </TMarker>
      <TMarker :lng-lat="[-21.94, 64.15]" draggable @dragend="save" />
      <TPopup :lng-lat="[-27.5, 38.5]">Azores</TPopup>
      <template #missing-token>Maps need a token.</template>
    </TMapView>
  </div>
</template>
```

The `useMap()` composable gives the engine's map to any component inside `TMapView`.

### Same concepts, idiomatic syntax

| React                               | Vue                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| `onLoad`, `onClick`, `onMove`…      | `@load`, `@click`, `@move`… plus `update:center`/`zoom`/`bearing`/`pitch` for `v-model` |
| `ref` → `{ getMap() }`              | template ref → `getMap()`                                                               |
| `popup={<TPopup/>}` on `TMarker`    | `#popup` slot                                                                           |
| `open` + `onOpenChange` on `TPopup` | `v-model:open`                                                                          |
| `onStatusChange`, `onFeatureClick`… | `@status-change`, `@feature-click`…                                                     |
| `missingTokenLabel`                 | `missing-token-label`, or the `missing-token` slot                                      |

### Behaviour every layer component shares

- **Ids:**
  - `id` is required and must be unique on the map. A duplicate is ignored, with one console warning.
  - `TGeoJsonLayer` and `TRasterTileLayer` use the id for both their source and their layer.
  - A clustered GeoJSON layer adds `<id>-clusters` and `<id>-cluster-count`.
- **When it mounts:** before or after the map loads; either works.
- **Style changes:** a `mapStyle` change keeps every source and layer (they are re-applied).
- **Prop changes** update the existing layer (`setData`, `setPaintProperty`, `setLayoutProperty`, `setFilter`…).
  Only clustering options and tile size re-create the source.
- **Unmounting** removes the layers, then the source, with no leftovers.
- **Placement:**
  - `slot` (`'bottom' | 'middle' | 'top'`) places a layer in the Standard style's basemap.
  - `beforeId` puts it under another layer of the same slot.
  - Unset: on top.
- **Remote GeoJSON** (`data` as a URL):
  - status goes through `onStatusChange` / `@status-change` (`loading`, `loaded`, `error` with the error);
  - a stale request is aborted when the URL changes or the layer unmounts;
  - `refreshInterval` re-fetches and keeps the last data visible meanwhile.

## Markers or layers?

| Use                                        | When                                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `TMarker`                                  | A handful of points that need HTML content, dragging or their own popup. Each is a DOM element. |
| `TGeoJsonLayer` `type="circle"`/`"symbol"` | Many points (Mapbox advises layers past ~100 markers): drawn in WebGL, filterable, clickable.   |
| `TGeoJsonLayer` with `cluster`             | Dense points: counted clusters that split as you zoom in (a click zooms to the split).          |
| `TGeoJsonLayer` `type="line"`/`"fill"`     | Any line or polygon.                                                                            |

For a popup on a layer's feature, use `onFeatureClick` and a standalone `TPopup` at the event's `lngLat`.

## Adding a layer type

1. **map-core:**
   - add its spec type to `src/types.ts`;
   - add a pure builder to `src/layers.ts` that returns the source spec and the layer specs (as
     `geoJsonLayers` and `rasterTileLayer` do);
   - export both from `src/index.ts`.
2. **React (`packages/ui/src/components/T<Name>/`):**
   - a component that gets `layers` from `useMapContext`, and an owner from `useOwner()`;
   - an effect keyed on `id` that calls `addSource`/`addLayer`, and whose cleanup calls
     `removeLayer`/`removeSource`;
   - an effect with no deps that calls `updateSource`/`updateLayer` (the manager skips unchanged values);
   - export it from `src/map.ts`.
3. **Vue (`packages/ui-vue/src/components/T<Name>/`):**
   - the same through an immediate `watch` on `id` (its cleanup removes), plus a `watch` that updates;
   - export it from `src/map.ts`.
4. **Docs:** add an entry to both docs apps' map group.

Never call the engine's `addSource`/`addLayer`/`removeLayer` from a component. Going through the manager is
what keeps layers across style changes and makes cleanup safe.

## Limits

- Inline GeoJSON is compared by identity.
- Custom marker content, the marker anchor, the popup anchor and the close button are fixed when they mount.
- The camera is "soft-controlled": the user can still move the map. Feed `onMove` back into the props to keep
  them in sync.
- The engine (about 1.9 MB, 540 kB gzipped) is bundled by each app that shows a map. The docs apps load it
  lazily, with their map demo.
