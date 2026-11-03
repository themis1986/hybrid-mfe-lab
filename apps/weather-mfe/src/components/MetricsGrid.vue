<script setup lang="ts">
import { TGrid, TIcon, TProgress } from '@repo/ui-vue'
import {
  Droplets,
  Gauge,
  Leaf,
  Navigation2,
  Sun,
  Sunrise,
  Wind,
} from '@repo/ui-vue/icons'
import { computed } from 'vue'
import { useAirQuality } from '../hooks/useAirQuality'
import { useForecast } from '../hooks/useForecast'
import { useWeatherState } from '../hooks/useWeatherState'
import {
  aqiBand,
  compassPoint,
  formatClock,
  formatSpeed,
  uvBand,
} from '../lib/units'
import MetricTile from './MetricTile.vue'
import SkeletonBlock from './SkeletonBlock.vue'

const { units } = useWeatherState()
const { data, isPending, isPlaceholderData } = useForecast()
const { data: airQuality } = useAirQuality()

const current = computed(() => data.value?.current)
const today = computed(() => data.value?.daily[0])

const uv = computed(() =>
  today.value ? uvBand(today.value.uvIndexMax) : undefined,
)
const aqi = computed(() => {
  const value = airQuality.value?.europeanAqi
  return value == null ? undefined : { value, ...aqiBand(value) }
})
</script>

<template>
  <TGrid v-if="isPending" min-child-width="9rem" :gap="3">
    <SkeletonBlock v-for="tile in 6" :key="tile" class="h-28" />
  </TGrid>
  <TGrid
    v-else-if="current && today"
    min-child-width="9rem"
    :gap="3"
    :class="[
      'transition-opacity duration-300',
      isPlaceholderData && 'opacity-60',
    ]"
  >
    <MetricTile
      label="Wind"
      :icon="Wind"
      :value="formatSpeed(current.windSpeed, units)"
    >
      <template #hint>
        <span class="inline-flex items-center gap-1">
          <!-- The API gives where the wind comes from; the arrow shows where it blows. -->
          <TIcon
            :icon="Navigation2"
            size="sm"
            class="size-3"
            :style="{ transform: `rotate(${current.windDirection + 180}deg)` }"
          />
          {{ compassPoint(current.windDirection) }} · gusts
          {{ formatSpeed(current.windGusts, units) }}
        </span>
      </template>
    </MetricTile>

    <MetricTile
      label="Humidity"
      :icon="Droplets"
      :value="`${current.humidity}%`"
    >
      <template #extra>
        <TProgress
          :value="current.humidity"
          size="sm"
          tone="info"
          aria-label="Humidity"
          class="mt-2"
        />
      </template>
    </MetricTile>

    <MetricTile
      label="UV today"
      :icon="Sun"
      :value="today.uvIndexMax.toFixed(1)"
      :hint="uv?.label"
    >
      <template #extra>
        <TProgress
          :value="Math.min(today.uvIndexMax, 11)"
          :max="11"
          size="sm"
          :tone="uv?.tone"
          aria-label="UV index"
          class="mt-2"
        />
      </template>
    </MetricTile>

    <MetricTile
      label="Air quality"
      :icon="Leaf"
      :value="aqi ? String(Math.round(aqi.value)) : undefined"
      :hint="aqi ? aqi.label : 'Not available'"
    >
      <template #extra>
        <TProgress
          v-if="aqi"
          :value="Math.min(aqi.value, 100)"
          size="sm"
          :tone="aqi.tone"
          aria-label="European air quality index"
          class="mt-2"
        />
      </template>
    </MetricTile>

    <MetricTile
      label="Pressure"
      :icon="Gauge"
      :value="`${Math.round(current.pressure)} hPa`"
      hint="At sea level"
    />

    <MetricTile
      label="Sunrise"
      :icon="Sunrise"
      :value="formatClock(today.sunrise)"
      :hint="`Sunset ${formatClock(today.sunset)}`"
    />
  </TGrid>
</template>
