import { TSpinner } from '@repo/ui'
import { lazy, Suspense } from 'react'
import type { DocEntry, DocProp } from './catalog'

// The map group's entries. One live demo, on TMapView: each map counts as a billed Mapbox map load.
const MapDemo = lazy(() => import('./demos/MapDemo'))

const placementProps: DocProp[] = [
  {
    name: 'beforeId',
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
const featureProps: DocProp[] = [
  {
    name: 'onFeatureClick',
    type: '(event: FeatureEvent) => void',
    description: '{ feature, lngLat, originalEvent }. Shows a pointer cursor.',
  },
  {
    name: 'onFeatureEnter',
    type: '(event: FeatureEvent) => void',
    description: 'The pointer entered a feature.',
  },
  {
    name: 'onFeatureLeave',
    type: '() => void',
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
      'A Mapbox GL JS map filling its parent (give the parent a height). Its children are markers, popups and layers; they survive a style change and are removed with the map. Import from @repo/ui/map. Without a token it shows a message instead.',
    props: [
      {
        name: 'accessToken',
        type: 'string',
        description:
          'A public Mapbox token. Pass the app’s, e.g. import.meta.env.VITE_MAPBOX_TOKEN.',
      },
      {
        name: 'mapStyle',
        type: 'string | StyleSpecification',
        default: "'mapbox://styles/mapbox/standard'",
        description: 'Changing it keeps every child layer.',
      },
      {
        name: 'initialViewState',
        type: 'Partial<ViewState>',
        description: '{ center, zoom, bearing, pitch } at creation.',
      },
      {
        name: 'center / zoom / bearing / pitch',
        type: 'LngLatTuple / number',
        description:
          'Controlled view: the map jumps when they change. Pass back what onMove gives.',
      },
      {
        name: 'bounds',
        type: '[west, south, east, north]',
        description: 'Fitted at creation and whenever it changes.',
      },
      {
        name: 'fitBoundsOptions',
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
        name: 'missingTokenLabel',
        type: 'string',
        default: '"Set a Mapbox access token to show the map."',
        description: 'Shown in place of the map without a token.',
      },
      {
        name: 'onLoad / onClick / onError',
        type: '(map) / (MapMouseEvent) / (Error)',
        description: 'Errors are logged when there is no onError.',
      },
      {
        name: 'onMove / onMoveEnd',
        type: '(view: ViewState) => void',
        description: 'Every camera frame / the end of a movement.',
      },
      {
        name: 'ref',
        type: 'Ref<TMapViewHandle>',
        description: '{ getMap() }: the engine’s map, the escape hatch.',
      },
    ],
    demo: (
      <Suspense fallback={<TSpinner />}>
        <MapDemo />
      </Suspense>
    ),
    code: `import { TGeoJsonLayer, TMapView, TMarker, TPopup } from '@repo/ui/map'

<div className="h-96">
  <TMapView accessToken={import.meta.env.VITE_MAPBOX_TOKEN} initialViewState={{ center: [-9.14, 38.72], zoom: 5 }}>
    <TGeoJsonLayer id="quakes" data="https://example.org/quakes.geojson" type="circle" cluster />
    <TMarker lngLat={[-9.14, 38.72]} popup={<TPopup>Lisbon</TPopup>} />
  </TMapView>
</div>`,
  },
  {
    id: 'marker',
    name: 'TMarker',
    group: 'maps',
    summary:
      'A DOM marker at a position: children are its content (the default pin without children). For more than a handful of points, use a TGeoJsonLayer.',
    props: [
      { name: 'lngLat', type: '[lng, lat]', description: 'Its position.' },
      {
        name: 'draggable',
        type: 'boolean',
        default: 'false',
        description: 'onDragEnd reports the drop position.',
      },
      {
        name: 'anchor',
        type: 'Anchor',
        default: "'center'",
        description: 'The part of the marker on the position.',
      },
      { name: 'offset', type: '[x, y]', description: 'Pixels.' },
      {
        name: 'popup',
        type: 'ReactNode',
        description: 'A TPopup, opened by a click on the marker.',
      },
      {
        name: 'onClick / onDragEnd',
        type: '(MouseEvent) / (lngLat) => void',
        description: 'Clicks; the drop position.',
      },
    ],
    code: `<TMarker lngLat={[-9.14, 38.72]} popup={<TPopup offset={20}>Lisbon</TPopup>}>
  <span className="block size-4 rounded-full bg-accent" />
</TMarker>`,
  },
  {
    id: 'popup',
    name: 'TPopup',
    group: 'maps',
    summary:
      'A popup at a position, or on a marker when passed as its popup. Children are its content.',
    props: [
      {
        name: 'lngLat',
        type: '[lng, lat]',
        description: 'Standalone: where it points.',
      },
      {
        name: 'open / onOpenChange',
        type: 'boolean / (open) => void',
        description:
          'Controlled. Unset: a standalone popup is open; a marker’s opens on click.',
      },
      {
        name: 'closeButton',
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
    code: `<TPopup lngLat={[-27.5, 38.5]} open={open} onOpenChange={setOpen}>Azores</TPopup>`,
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
        description: 'Inline (keep its identity stable) or a URL.',
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
        name: 'refreshInterval',
        type: 'number',
        description: 'URL data: re-fetch every N ms.',
      },
      {
        name: 'onStatusChange',
        type: '(status, error?) => void',
        description: "URL data: 'loading' | 'loaded' | 'error'.",
      },
      ...placementProps,
      ...featureProps,
    ],
    code: `<TGeoJsonLayer
  id="quakes"
  data="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
  type="circle"
  cluster
  refreshInterval={60_000}
  onStatusChange={(status, error) => setStatus(error?.message ?? status)}
  onFeatureClick={({ feature }) => setPicked(feature.properties?.title)}
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
        name: 'tileSize',
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
    code: `<TRasterTileLayer id="osm" tiles="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" opacity={0.5} />`,
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
      ...featureProps,
    ],
    code: `<TSource id="terrain" spec={{ type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' }}>
  <TLayer id="contours" spec={{ type: 'line', source: 'terrain', 'source-layer': 'contour', paint: { 'line-opacity': 0.4 } }} />
</TSource>`,
  },
]
