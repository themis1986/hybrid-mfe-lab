import { createRemoteHost } from './RemoteMfeHost'

export const WEATHER_BASE_PATH = '/weather-app'

export const WeatherMfeHost = createRemoteHost(
  () => import('weather/mount'),
  WEATHER_BASE_PATH,
  'Weather app',
)
