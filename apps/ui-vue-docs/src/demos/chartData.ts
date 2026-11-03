import type { ChartSeries } from '@repo/ui-vue/charts'

// Generated demo data: no network. A seeded generator, so every load starts from the same numbers.
let seed = 7
const random = () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}
const around = (base: number, spread: number) =>
  Math.round(base + (random() - 0.5) * spread)

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
export const regions = ['North', 'South', 'East', 'West']

export function traffic(): ChartSeries[] {
  return [
    {
      id: 'web',
      name: 'Web',
      data: months.map((_, i) => around(420 + i * 18, 120)),
    },
    {
      id: 'mobile',
      name: 'Mobile',
      data: months.map((_, i) => around(300 + i * 25, 100)),
    },
    { id: 'api', name: 'API', data: months.map(() => around(160, 80)) },
  ]
}

export function sales(): ChartSeries[] {
  return [
    {
      id: 'hardware',
      name: 'Hardware',
      data: regions.map(() => around(120, 80)),
    },
    {
      id: 'software',
      name: 'Software',
      data: regions.map(() => around(90, 60)),
    },
    {
      id: 'services',
      name: 'Services',
      data: regions.map(() => around(60, 40)),
    },
  ]
}

export function share(): ChartSeries[] {
  return [
    { id: 'share', name: 'Share', data: regions.map(() => around(30, 30)) },
  ]
}
