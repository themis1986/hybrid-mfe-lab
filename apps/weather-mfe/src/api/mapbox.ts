import type { Place } from '../types'
import { getJson } from './http'

const REVERSE_URL = 'https://api.mapbox.com/search/geocode/v6/reverse'

interface ReverseResponse {
  features: {
    properties: {
      name?: string
      place_formatted?: string
    }
  }[]
}

export interface PlaceName {
  name: string
  region?: string
}

/**
 * The name of a point, or null where there is none (open water).
 *
 * Mapbox's default "temporary" results may be displayed but not cached or stored: see usePlaceName for how
 * this app keeps to that.
 */
export async function reversePlaceName(
  { latitude, longitude }: Place,
  accessToken: string,
  signal?: AbortSignal,
): Promise<PlaceName | null> {
  const url = new URL(REVERSE_URL)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  // Town level and up: a street name would say less than the town it is in.
  url.searchParams.set('types', 'place,locality,region,country')
  url.searchParams.set('language', 'en')
  url.searchParams.set('access_token', accessToken)
  const { features } = await getJson<ReverseResponse>(url, signal)
  const properties = features[0]?.properties
  if (!properties?.name) return null
  return { name: properties.name, region: properties.place_formatted }
}
