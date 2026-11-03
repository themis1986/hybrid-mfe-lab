<script setup lang="ts">
import { TCard, TTabs, TTabsList, TTabsTrigger } from '@repo/ui-vue'
import { type ChartOptions, TChart } from '@repo/ui-vue/charts'
import { computed, ref } from 'vue'
import { useForecast } from '../hooks/useForecast'
import { useWeatherState } from '../hooks/useWeatherState'
import {
  formatClock,
  speedUnit,
  temperatureUnit,
  toSpeed,
  toTemperature,
} from '../lib/units'
import type { HourlyWeather } from '../types'

// Split from the page and loaded lazily, so the chart engine downloads only with it.
type Metric = 'temperature' | 'rain' | 'wind'

const { units } = useWeatherState()
const { data, isPending } = useForecast()
const metric = ref<Metric>('temperature')

const hours = computed<HourlyWeather[]>(() => data.value?.hourly ?? [])
const categories = computed(() =>
  hours.value.map(({ time }) => formatClock(time)),
)

const view = computed(() => {
  switch (metric.value) {
    case 'rain':
      return {
        name: 'Chance of rain',
        color: 'info',
        unit: '%',
        values: hours.value.map((hour) => hour.rainChance),
      }
    case 'wind':
      return {
        name: 'Wind',
        color: 'chart-3',
        unit: ` ${speedUnit(units.value)}`,
        values: hours.value.map((hour) => toSpeed(hour.windSpeed, units.value)),
      }
    default:
      return {
        name: 'Temperature',
        color: 'chart-2',
        unit: temperatureUnit(units.value),
        values: hours.value.map((hour) =>
          toTemperature(hour.temperature, units.value),
        ),
      }
  }
})

const series = computed(() => [
  {
    id: 'hourly',
    name: view.value.name,
    color: view.value.color,
    marker: false as const,
    data: view.value.values,
  },
])

const valueFormat = computed(() => {
  const { unit } = view.value
  return (value: number) => `${Math.round(value)}${unit}`
})

// A soft area with quiet gridlines. Temperature isn't a quantity from zero, so its axis fits the data
// (threshold: null); rain always shows its full 0–100 scale. Hourly labels thin out on a narrow chart.
const options = computed<ChartOptions>(() => ({
  plotOptions: {
    area: {
      fillOpacity: 0.15,
      lineWidth: 2,
      threshold: metric.value === 'temperature' ? null : 0,
    },
  },
  xAxis: { tickLength: 0, lineWidth: 0, labels: { step: 3 } },
  yAxis: {
    gridLineDashStyle: 'Dot',
    title: { text: undefined },
    min: metric.value === 'rain' ? 0 : undefined,
    max: metric.value === 'rain' ? 100 : undefined,
  },
  responsive: {
    rules: [
      {
        condition: { maxWidth: 420 },
        chartOptions: { xAxis: { labels: { step: 6 } } },
      },
    ],
  },
}))
</script>

<template>
  <TCard variant="filled" :padding="4" as="section" aria-label="Next 24 hours">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="m-0 text-base font-semibold tracking-tight">Next 24 hours</h2>
      <TTabs v-model="metric">
        <TTabsList variant="pills">
          <TTabsTrigger value="temperature">Temperature</TTabsTrigger>
          <TTabsTrigger value="rain">Rain</TTabsTrigger>
          <TTabsTrigger value="wind">Wind</TTabsTrigger>
        </TTabsList>
      </TTabs>
    </div>
    <div class="mt-3 h-64">
      <TChart
        type="area"
        :aria-label="`${view.name} over the next 24 hours`"
        :categories="categories"
        :series="series"
        :value-format="valueFormat"
        :legend="false"
        :loading="isPending"
        :options="options"
      />
    </div>
  </TCard>
</template>
