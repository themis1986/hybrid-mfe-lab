# Decision record: interactive maps

Status: accepted, 2026-11-03. Research done on that date against npm and the official documentation.

The design system gained a declarative map in both component libraries: a map view, DOM markers, popups,
GeoJSON layers (inline or remote, optionally clustered), XYZ raster tiles and raw source/layer escape hatches.
This record explains the choices. How to use the components is in
[packages/map-core/README.md](../../packages/map-core/README.md).

## Shape

```
packages/map-core   @repo/map-core   framework-agnostic: types, the layer manager, spec builders, overlays,
                                     the remote GeoJSON loader, the engine's CSS (injected)
packages/ui         @repo/ui/map     the React components, on map-core
packages/ui-vue     @repo/ui-vue/map the Vue components, on map-core
```

- The libraries' map components live in a separate `./map` entry, like `./icons`. Apps that don't show a map
  never bundle the engine (about 1.9 MB, 540 kB gzipped).
- map-core holds every call that touches sources and layers, so both frameworks share one implementation
  and the same behaviour. The framework components only translate props into registry calls.

## 1. The engine: Mapbox GL JS 3.34

The engine was fixed by the brief; MapLibre was not substituted.

- **Version:** 3.34.1 (`^3.34.1` in the catalog). 3.34.2 came out the same day and is held back by pnpm's
  24-hour release-age gate.
- **Types:** bundled with the package (`dist/mapbox-gl.d.ts`). `@types/mapbox-gl` is not needed. The bundled
  types use the global `GeoJSON` namespace, so map-core depends on `@types/geojson`.
- **CSS:** `mapbox-gl/dist/mapbox-gl.css` must be loaded separately. map-core imports it with `?inline` and
  injects it once as `<style id="t-map-styles">`, inside `@layer components`. Hosts load no CSS file, which
  matches how remotes carry their CSS. The cascade layer lets the libraries' token utilities (in `utilities`)
  restyle popups. The style is never removed, because maps from several bundles may share it.
- **Entry:** the default (UMD) entry, not `mapbox-gl/esm`.
  - Mapbox recommends the ESM entry for bundlers since 3.25: it is split into chunks.
  - But it starts its worker with `new Worker(new URL('worker.js', import.meta.url))`. That breaks under Vite's
    dependency pre-bundling, and a federated remote runs on another origin than its host.
  - The default entry carries its worker as a blob, which works in dev, in production and across origins.
  - The choice is confined to map-core.
- **Token:**
  - Every map needs a public token (`pk.…`), passed in the `Map` options. The ESM entry no longer supports
    the global setter, and the options work in both entries.
  - A library can't read the token from the environment: Vite's library mode replaces `import.meta.env.*`
    when the library itself is built, so the value would be baked in as empty. Each app reads
    `VITE_MAPBOX_TOKEN` from its own `.env.local` and passes it in. Without a token, the map view shows a
    message and creates no map.
- **License and cost:**
  - Since v2, Mapbox GL JS is proprietary, under the Mapbox Terms of Service; the npm license field says
    "SEE LICENSE IN LICENSE.txt". It is not open source, and it may only be used with a Mapbox account.
  - Usage is billed per web map load (each map object created), with a monthly free tier. An account
    without a payment method gets a capped default token.
  - The token ships in the browser bundle, so use a URL-restricted public token.
  - Dev mode under React StrictMode creates each map twice, which counts two loads. The docs show one live map
    per library for that reason.

## 2. React: a thin wrapper, not react-map-gl

- react-map-gl 8.1.3 (MIT, maintained by vis.gl) supports Mapbox GL ≥ 3.5 through `react-map-gl/mapbox`, and
  handles controlled cameras well.
- Its sources and layers have their own lifecycle and style-reload logic. Using it would put the React
  layer logic there and the Vue layer logic elsewhere, but the brief requires one shared implementation.
- A thin wrapper on map-core adds no dependency and gives full control over teardown (StrictMode, federated
  unmounts).

## 3. Vue: own composables and components, no community wrapper

| Wrapper                         | Why not                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `@studiometa/vue-mapbox-gl` 2.7 | GPL-3.0-or-later: copyleft, at odds with this MIT repo. Last published Feb 2025. |
| `v-mapbox` 5.1                  | MapLibre only now (peer `maplibre-gl ^4`). Last published May 2024.              |
| `@indoorequal/vue-maplibre-gl`  | MapLibre only.                                                                   |
| `vue-mapbox-ts` 0.10            | A small single-author project; its own layer model, not shared with React.       |

## 4. Patterns per framework

- **React:**
  - The map view creates the map in an effect and removes it in the cleanup, so StrictMode's second run
    starts from scratch.
  - Children render only once the map exists, under a context.
  - Each layer component adds itself in an effect keyed on its id, and updates in separate effects.
  - The latest callbacks sit in a ref, so engine listeners are bound once.
- **Vue:**
  - The map sits in a `shallowRef` and is never made reactive.
  - It is created in `onMounted` and removed in `onUnmounted`, which runs after the children's cleanup.
  - Children get it through `provide`/`inject`, and render behind a `v-if` on the map.
  - Layer components add themselves in an immediate `watch` on their id; the watch's cleanup removes them.
    Other `watch`es update them.

## 5. Engine lifecycle, and how the layer manager handles it

- **Sources and layers need a loaded style.** The manager records what components register and applies it
  on `style.load`. It tracks readiness itself, because `isStyleLoaded()` can be false while tiles load.
  Components can mount before or after the map loads.
- **`setStyle` drops custom sources and layers.**
  - The map view tells the manager first, and calls `setStyle(style, { diff: false })` so nothing survives
    half-diffed.
  - The manager re-applies its whole registry on the next `style.load`, guarded by `getSource`/`getLayer`.
- **Ordering:**
  - The Standard style places custom layers through slots (`bottom`, `middle`, `top`), and ignores `beforeId`
    across slots. Layer components therefore take a slot as well as a before-id.
  - A before-id that names a layer registered later is honoured once both are on the map.
- **Updates in place:** `setData`, `setTiles`/`setUrl`, `setPaintProperty`/`setLayoutProperty` (key by key),
  `setFilter`, `setLayerZoomRange`, `setSlot`, `moveLayer`. Only a structural change re-creates a source
  with its layers: clustering on or off, cluster radius, tile size.
- **Cleanup:**
  - Removing a source first removes the layers that use it.
  - A layer registered before its source waits for it. In React, a child's effects run before its parent's.
- **Unmount order:**
  - React runs a parent's cleanups before its children's, so the map can be gone when a layer cleans up.
  - Once the manager is destroyed, every call is a no-op.
  - In Vue the children clean up first.
- **Duplicate ids:** each registration has an owner object. A second owner's id is ignored with one warning,
  and can't remove the first owner's registration.
- **Size:** a `ResizeObserver` on the container calls `map.resize()`. The parent sets the size.
- **Controlled camera:** camera props are applied with `jumpTo` only when they differ from the camera (with a
  small tolerance). A parent that feeds move events back into the props doesn't loop.

## 6. Markers or layers

- **DOM markers** are HTML elements positioned over the canvas. They suit a handful of interactive points:
  custom content, dragging, a popup. Mapbox's guidance is to switch to style layers past roughly 100 points.
- **Style layers on a GeoJSON source** are drawn in WebGL. They suit any number of points, and every line and
  polygon.
- **Clustering** is done by the GeoJSON source (`cluster`, `clusterRadius`, `clusterMaxZoom`).
  - Clusters are point features with `point_count` and `cluster_id`.
  - The GeoJSON layer component draws them as a circle layer plus a count label. Its own layer is filtered
    to the unclustered points.
  - A click on a cluster eases to `getClusterExpansionZoom`.

## Trade-offs accepted

- The engine is bundled per remote, like the frameworks (`shared: {}`), and only in the chunk that shows a map.
- Inline GeoJSON is compared by identity: a new object each render is sent to the map again. Apps keep data
  at module level or memoize it.
- Default paint colours are fixed hex values from the token scales: WebGL paint can't read CSS variables.

## Next steps

- Bounds-based loading for GeoJSON servers (WFS, OGC API Features): refetch with the view's bounds on `moveend`.
- Hover styling with feature-state instead of callbacks only.
- A MapLibre fallback: map-core is the only place that calls the engine.
- Sharing the engine (and the frameworks) through federation `shared`.
