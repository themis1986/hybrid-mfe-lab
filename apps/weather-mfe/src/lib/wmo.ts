import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from '@repo/ui-vue/icons'
import type { Component } from 'vue'

interface Condition {
  label: string
  day: Component
  night: Component
  sky: Sky
}

type Sky = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow'

/** What the WMO weather codes the API sends mean. */
const CONDITIONS: Record<number, Condition> = {
  0: { label: 'Clear sky', day: Sun, night: Moon, sky: 'clear' },
  1: { label: 'Mainly clear', day: Sun, night: Moon, sky: 'clear' },
  2: { label: 'Partly cloudy', day: CloudSun, night: CloudMoon, sky: 'cloudy' },
  3: { label: 'Overcast', day: Cloud, night: Cloud, sky: 'cloudy' },
  45: { label: 'Fog', day: CloudFog, night: CloudFog, sky: 'cloudy' },
  48: { label: 'Freezing fog', day: CloudFog, night: CloudFog, sky: 'cloudy' },
  51: {
    label: 'Light drizzle',
    day: CloudDrizzle,
    night: CloudDrizzle,
    sky: 'rain',
  },
  53: { label: 'Drizzle', day: CloudDrizzle, night: CloudDrizzle, sky: 'rain' },
  55: {
    label: 'Heavy drizzle',
    day: CloudDrizzle,
    night: CloudDrizzle,
    sky: 'rain',
  },
  56: {
    label: 'Freezing drizzle',
    day: CloudDrizzle,
    night: CloudDrizzle,
    sky: 'rain',
  },
  57: {
    label: 'Freezing drizzle',
    day: CloudDrizzle,
    night: CloudDrizzle,
    sky: 'rain',
  },
  61: { label: 'Light rain', day: CloudRain, night: CloudRain, sky: 'rain' },
  63: { label: 'Rain', day: CloudRain, night: CloudRain, sky: 'rain' },
  65: { label: 'Heavy rain', day: CloudRain, night: CloudRain, sky: 'rain' },
  66: { label: 'Freezing rain', day: CloudRain, night: CloudRain, sky: 'rain' },
  67: { label: 'Freezing rain', day: CloudRain, night: CloudRain, sky: 'rain' },
  71: { label: 'Light snow', day: CloudSnow, night: CloudSnow, sky: 'snow' },
  73: { label: 'Snow', day: CloudSnow, night: CloudSnow, sky: 'snow' },
  75: { label: 'Heavy snow', day: CloudSnow, night: CloudSnow, sky: 'snow' },
  77: { label: 'Snow grains', day: CloudSnow, night: CloudSnow, sky: 'snow' },
  80: { label: 'Light showers', day: CloudRain, night: CloudRain, sky: 'rain' },
  81: { label: 'Showers', day: CloudRain, night: CloudRain, sky: 'rain' },
  82: { label: 'Heavy showers', day: CloudRain, night: CloudRain, sky: 'rain' },
  85: { label: 'Snow showers', day: CloudSnow, night: CloudSnow, sky: 'snow' },
  86: {
    label: 'Heavy snow showers',
    day: CloudSnow,
    night: CloudSnow,
    sky: 'snow',
  },
  95: {
    label: 'Thunderstorm',
    day: CloudLightning,
    night: CloudLightning,
    sky: 'storm',
  },
  96: {
    label: 'Thunderstorm with hail',
    day: CloudHail,
    night: CloudHail,
    sky: 'storm',
  },
  99: {
    label: 'Thunderstorm with hail',
    day: CloudHail,
    night: CloudHail,
    sky: 'storm',
  },
}

const UNKNOWN: Condition = {
  label: 'Unknown',
  day: Cloud,
  night: Cloud,
  sky: 'cloudy',
}

// Only hues with a full scale in @repo/tokens. The steps are light-dark() pairs, so each gradient suits both
// themes and the normal text colour stays readable on it.
const SKY_DAY: Record<Sky, string> = {
  clear: 'from-(--t-amber-4) via-(--t-amber-2) to-(--t-blue-4)',
  cloudy: 'from-(--t-slate-4) via-(--t-slate-2) to-(--t-blue-3)',
  rain: 'from-(--t-blue-5) via-(--t-blue-3) to-(--t-slate-3)',
  storm: 'from-(--t-iris-5) via-(--t-slate-4) to-(--t-slate-3)',
  snow: 'from-(--t-blue-3) via-(--t-slate-2) to-(--t-iris-3)',
}
const SKY_NIGHT: Record<Sky, string> = {
  clear: 'from-(--t-iris-5) via-(--t-iris-3) to-(--t-blue-3)',
  cloudy: 'from-(--t-slate-5) via-(--t-slate-3) to-(--t-iris-3)',
  rain: 'from-(--t-blue-5) via-(--t-slate-4) to-(--t-slate-3)',
  storm: 'from-(--t-iris-6) via-(--t-slate-5) to-(--t-slate-3)',
  snow: 'from-(--t-iris-4) via-(--t-slate-3) to-(--t-blue-3)',
}

export function describeWeather(code: number, isDay = true) {
  const condition = CONDITIONS[code] ?? UNKNOWN
  return {
    label: condition.label,
    icon: isDay ? condition.day : condition.night,
    sky: (isDay ? SKY_DAY : SKY_NIGHT)[condition.sky],
  }
}
