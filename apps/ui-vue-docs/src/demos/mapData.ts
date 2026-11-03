import type { GeoJSON, LngLatTuple, ViewState } from '@repo/ui-vue/map'

// Sample data for the map demo. Declared once at module level: a new object passed as a layer's data is
// sent to the map again.

export const mapStyles = {
  standard: 'mapbox://styles/mapbox/standard',
  light: 'mapbox://styles/mapbox/light-v11',
}

export const initialView: Partial<ViewState> = {
  center: [-35, 38],
  zoom: 1.8,
}

export const places: { name: string; lngLat: LngLatTuple }[] = [
  { name: 'Lisbon', lngLat: [-9.14, 38.72] },
  { name: 'New York', lngLat: [-74.01, 40.71] },
  { name: 'Reykjavik', lngLat: [-21.94, 64.15] },
]

export const azores: LngLatTuple = [-27.5, 38.5]

/** A rough outline of the Iberian Peninsula. */
export const iberia: GeoJSON = {
  type: 'Feature',
  properties: { name: 'Iberian Peninsula' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-9.5, 43.7],
        [-1.8, 43.4],
        [3.2, 42.4],
        [0.2, 38.8],
        [-2.2, 36.7],
        [-6.0, 36.0],
        [-8.9, 37.0],
        [-9.5, 38.8],
        [-8.9, 41.8],
        [-9.5, 43.7],
      ],
    ],
  },
}

/** Lisbon to New York, straight on the map. */
export const crossing: GeoJSON = {
  type: 'Feature',
  properties: { name: 'Lisbon – New York' },
  geometry: {
    type: 'LineString',
    coordinates: [
      [-9.14, 38.72],
      [-27.5, 38.5],
      [-74.01, 40.71],
    ],
  },
}

// USGS earthquake feed (magnitude 2.5+, past week): public domain, served with CORS, updated every minute.
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
export const earthquakesUrl =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'

// OpenStreetMap's tiles: light use with attribution, per https://operations.osmfoundation.org/policies/tiles/
export const osmTiles = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
export const osmAttribution = '© OpenStreetMap contributors'
