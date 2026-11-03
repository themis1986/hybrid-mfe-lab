/** A point on the map. Coordinates are rounded (see lib/place.ts). A clicked point has no name of its own. */
export interface Place {
  latitude: number
  longitude: number
  name?: string
  /** Region and country, under the name. */
  region?: string
}

export type Units = 'metric' | 'imperial'

/** All values are metric, as the API sends them; lib/units.ts converts at display. Times are the place's local time. */
export interface CurrentWeather {
  time: string
  isDay: boolean
  weatherCode: number
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: number
  windGusts: number
  pressure: number
}

export interface HourlyWeather {
  time: string
  temperature: number
  rainChance: number
  windSpeed: number
}

export interface DailyWeather {
  date: string
  weatherCode: number
  min: number
  max: number
  rainChance: number
  uvIndexMax: number
  sunrise: string
  sunset: string
}

export interface Forecast {
  timezone: string
  current: CurrentWeather
  /** The next 24 hours, from the current one. */
  hourly: HourlyWeather[]
  /** Seven days, from today. */
  daily: DailyWeather[]
}

export interface AirQuality {
  /** European AQI; null where the model has no value. */
  europeanAqi: number | null
  pm25: number | null
  pm10: number | null
}
