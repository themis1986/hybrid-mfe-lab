import { createPlace } from '../lib/place'
import type { AirQuality, Forecast, Place } from '../types'
import { getJson } from './http'

// Open-Meteo: free for non-commercial use, no key, CC BY 4.0 (the page footer carries the credit).
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

interface ForecastResponse {
  timezone: string
  current: {
    time: string
    is_day: number
    weather_code: number
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    wind_direction_10m: number
    wind_gusts_10m: number
    pressure_msl: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: (number | null)[]
    wind_speed_10m: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_min: number[]
    temperature_2m_max: number[]
    precipitation_probability_max: (number | null)[]
    uv_index_max: (number | null)[]
    sunrise: string[]
    sunset: string[]
  }
}

interface AirQualityResponse {
  current: {
    european_aqi: number | null
    pm2_5: number | null
    pm10: number | null
  }
}

interface GeocodingResponse {
  // Absent when nothing matches.
  results?: {
    name: string
    latitude: number
    longitude: number
    admin1?: string
    country?: string
  }[]
}

function withCoordinates(base: string, { latitude, longitude }: Place): URL {
  const url = new URL(base)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('timezone', 'auto')
  return url
}

export async function fetchForecast(
  place: Place,
  signal?: AbortSignal,
): Promise<Forecast> {
  const url = withCoordinates(FORECAST_URL, place)
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl',
  )
  url.searchParams.set(
    'hourly',
    'temperature_2m,precipitation_probability,wind_speed_10m',
  )
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max,uv_index_max,sunrise,sunset',
  )
  url.searchParams.set('forecast_days', '7')

  const { timezone, current, hourly, daily } = await getJson<ForecastResponse>(
    url,
    signal,
  )

  // Both are local-time ISO strings, so they compare as text; `current` can fall inside an hour.
  const currentHour = `${current.time.slice(0, 13)}:00`
  const firstHour = Math.max(
    hourly.time.findIndex((time) => time >= currentHour),
    0,
  )

  return {
    timezone,
    current: {
      time: current.time,
      isDay: current.is_day === 1,
      weatherCode: current.weather_code,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      windGusts: current.wind_gusts_10m,
      pressure: current.pressure_msl,
    },
    hourly: hourly.time.slice(firstHour, firstHour + 24).map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[firstHour + index]!,
      rainChance: hourly.precipitation_probability[firstHour + index] ?? 0,
      windSpeed: hourly.wind_speed_10m[firstHour + index]!,
    })),
    daily: daily.time.map((date, index) => ({
      date,
      weatherCode: daily.weather_code[index]!,
      min: daily.temperature_2m_min[index]!,
      max: daily.temperature_2m_max[index]!,
      rainChance: daily.precipitation_probability_max[index] ?? 0,
      uvIndexMax: daily.uv_index_max[index] ?? 0,
      sunrise: daily.sunrise[index]!,
      sunset: daily.sunset[index]!,
    })),
  }
}

export async function fetchAirQuality(
  place: Place,
  signal?: AbortSignal,
): Promise<AirQuality> {
  const url = withCoordinates(AIR_QUALITY_URL, place)
  url.searchParams.set('current', 'european_aqi,pm2_5,pm10')
  const { current } = await getJson<AirQualityResponse>(url, signal)
  return {
    europeanAqi: current.european_aqi,
    pm25: current.pm2_5,
    pm10: current.pm10,
  }
}

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<Place[]> {
  const url = new URL(GEOCODING_URL)
  url.searchParams.set('name', query)
  url.searchParams.set('count', '6')
  url.searchParams.set('language', 'en')
  const { results = [] } = await getJson<GeocodingResponse>(url, signal)
  return results.map((result) =>
    createPlace(result.latitude, result.longitude, {
      name: result.name,
      region: [result.admin1, result.country].filter(Boolean).join(', '),
    }),
  )
}
