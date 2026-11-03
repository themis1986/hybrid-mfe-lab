<script setup lang="ts">
import { TCard, TIcon } from '@repo/ui-vue'
import { Droplet } from '@repo/ui-vue/icons'
import { computed } from 'vue'
import { useForecast } from '../hooks/useForecast'
import { useWeatherState } from '../hooks/useWeatherState'
import { formatTemperature, formatWeekday } from '../lib/units'
import { describeWeather } from '../lib/wmo'
import SkeletonBlock from './SkeletonBlock.vue'

// Below this the chance of rain is noise, so it isn't shown.
const RAIN_HINT_FROM = 20

const { units } = useWeatherState()
const { data, isPending, isPlaceholderData } = useForecast()

// Each day's bar sits on the week's shared scale, so the days compare at a glance.
const days = computed(() => {
  const daily = data.value?.daily ?? []
  const low = Math.min(...daily.map((day) => day.min))
  const span = Math.max(...daily.map((day) => day.max)) - low || 1
  return daily.map((day, index) => ({
    ...day,
    title: index === 0 ? 'Today' : formatWeekday(day.date),
    weather: describeWeather(day.weatherCode),
    barStyle: {
      insetInlineStart: `${((day.min - low) / span) * 100}%`,
      width: `${((day.max - day.min) / span) * 100}%`,
    },
  }))
})
</script>

<template>
  <TCard variant="filled" :padding="4" as="section" aria-label="7-day forecast">
    <h2 class="m-0 text-base font-semibold tracking-tight">7-day forecast</h2>
    <div v-if="isPending" class="mt-3 flex flex-col gap-3">
      <SkeletonBlock v-for="row in 7" :key="row" class="h-6" />
    </div>
    <ul
      v-else
      :class="[
        'm-0 mt-2 list-none p-0 transition-opacity duration-300',
        isPlaceholderData && 'opacity-60',
      ]"
    >
      <li
        v-for="day in days"
        :key="day.date"
        class="grid grid-cols-[3rem_1.5rem_3rem_minmax(2rem,1fr)_auto] items-center gap-2 border-b border-line py-2 text-sm tabular-nums last:border-b-0"
      >
        <span class="font-medium">{{ day.title }}</span>
        <TIcon :icon="day.weather.icon" :label="day.weather.label" size="sm" />
        <span
          class="inline-flex items-center gap-0.5 text-xs text-(--t-blue-11)"
        >
          <template v-if="day.rainChance >= RAIN_HINT_FROM">
            <TIcon :icon="Droplet" size="sm" class="size-3" />
            {{ day.rainChance }}%
          </template>
        </span>
        <span class="relative h-1.5 rounded-full bg-(--t-slate-5)">
          <span
            class="absolute inset-y-0 min-w-1.5 rounded-full bg-linear-to-r from-(--t-blue-9) to-(--t-amber-9)"
            :style="day.barStyle"
          />
        </span>
        <span class="whitespace-nowrap">
          <span class="text-fg-muted">{{
            formatTemperature(day.min, units)
          }}</span>
          {{ formatTemperature(day.max, units) }}
        </span>
      </li>
    </ul>
  </TCard>
</template>
