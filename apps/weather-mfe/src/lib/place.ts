import type { Place } from '../types'

// Two decimals is about 1 km, finer than the forecast's grid: nearby clicks share a query's cached data.
const round = (value: number) => Math.round(value * 100) / 100

export function createPlace(
  latitude: number,
  longitude: number,
  names?: Pick<Place, 'name' | 'region'>,
): Place {
  return { latitude: round(latitude), longitude: round(longitude), ...names }
}

export const DEFAULT_PLACE = createPlace(37.98, 23.73, {
  name: 'Athens',
  region: 'Attica, Greece',
})

export function samePlace(a: Place, b: Place): boolean {
  return a.latitude === b.latitude && a.longitude === b.longitude
}

/** e.g. "37.98° N, 23.73° E". */
export function formatCoordinates({ latitude, longitude }: Place): string {
  const lat = `${Math.abs(latitude).toFixed(2)}° ${latitude < 0 ? 'S' : 'N'}`
  const lng = `${Math.abs(longitude).toFixed(2)}° ${longitude < 0 ? 'W' : 'E'}`
  return `${lat}, ${lng}`
}
