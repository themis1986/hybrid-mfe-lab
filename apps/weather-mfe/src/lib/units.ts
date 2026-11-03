import type { Units } from '../types'

const COMPASS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
]

export const toTemperature = (celsius: number, units: Units) =>
  units === 'metric' ? celsius : (celsius * 9) / 5 + 32

export const toSpeed = (kmh: number, units: Units) =>
  units === 'metric' ? kmh : kmh / 1.609344

export const speedUnit = (units: Units) => (units === 'metric' ? 'km/h' : 'mph')

export const temperatureUnit = (units: Units) =>
  units === 'metric' ? '°C' : '°F'

/** e.g. "17°": the unit stays on the toggle. */
export const formatTemperature = (celsius: number, units: Units) =>
  `${Math.round(toTemperature(celsius, units))}°`

export const formatSpeed = (kmh: number, units: Units) =>
  `${Math.round(toSpeed(kmh, units))} ${speedUnit(units)}`

export const compassPoint = (degrees: number) =>
  COMPASS[Math.round(degrees / 22.5) % 16]!

/** "14:00" from an API time. They are already the place's local time, so this never goes through Date. */
export const formatClock = (time: string) => time.slice(11, 16)

/** "Tue" from an API date. At noon UTC and formatted in UTC, so the viewer's own zone can't shift the day. */
export const formatWeekday = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en', {
    weekday: 'short',
    timeZone: 'UTC',
  })

export type Tone = 'success' | 'info' | 'warning' | 'danger'

export function uvBand(index: number): { label: string; tone: Tone } {
  if (index < 3) return { label: 'Low', tone: 'success' }
  if (index < 6) return { label: 'Moderate', tone: 'info' }
  if (index < 8) return { label: 'High', tone: 'warning' }
  if (index < 11) return { label: 'Very high', tone: 'danger' }
  return { label: 'Extreme', tone: 'danger' }
}

/** The European AQI's published bands. */
export function aqiBand(index: number): { label: string; tone: Tone } {
  if (index < 20) return { label: 'Good', tone: 'success' }
  if (index < 40) return { label: 'Fair', tone: 'info' }
  if (index < 60) return { label: 'Moderate', tone: 'warning' }
  if (index < 80) return { label: 'Poor', tone: 'danger' }
  if (index <= 100) return { label: 'Very poor', tone: 'danger' }
  return { label: 'Extremely poor', tone: 'danger' }
}
