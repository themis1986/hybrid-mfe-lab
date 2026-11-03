<script setup lang="ts">
import { TButton, TCard, TIcon } from '@repo/ui-vue'
import { Star } from '@repo/ui-vue/icons'
import { computed } from 'vue'
import { useForecast } from '../hooks/useForecast'
import { usePlaceName } from '../hooks/usePlaceName'
import { useWeatherState } from '../hooks/useWeatherState'
import { formatClock, formatTemperature } from '../lib/units'
import { describeWeather } from '../lib/wmo'
import ErrorPanel from './ErrorPanel.vue'
import SkeletonBlock from './SkeletonBlock.vue'

const { selected, units, isSelectedSaved, toggleSaved } = useWeatherState()
const { name, region } = usePlaceName()
const { data, isPending, isError, isPlaceholderData, refetch } = useForecast()

const current = computed(() => data.value?.current)
const today = computed(() => data.value?.daily[0])
const weather = computed(() =>
  current.value
    ? describeWeather(current.value.weatherCode, current.value.isDay)
    : undefined,
)
</script>

<template>
  <ErrorPanel
    v-if="isError && !data"
    message="Couldn’t load the weather"
    description="The forecast service didn’t answer. Check your connection and try again."
    @retry="refetch()"
  />
  <TCard
    v-else
    as="section"
    aria-label="Current weather"
    variant="elevated"
    :padding="5"
    :class="[
      'bg-linear-to-br transition-opacity duration-300',
      weather?.sky ?? 'from-(--t-slate-3) to-(--t-slate-2)',
      isPlaceholderData && 'opacity-60',
    ]"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="m-0 truncate text-xl font-semibold tracking-tight">
          {{ name }}
        </h2>
        <p class="m-0 mt-0.5 min-h-5 truncate text-sm text-fg-muted">
          {{ region }}
        </p>
      </div>
      <TButton
        variant="ghost"
        size="sm"
        :aria-pressed="isSelectedSaved"
        :aria-label="isSelectedSaved ? 'Remove from saved' : 'Save this place'"
        @click="toggleSaved(selected)"
      >
        <TIcon
          :icon="Star"
          size="sm"
          :class="isSelectedSaved && 'fill-current text-(--t-amber-9)'"
        />
      </TButton>
    </div>

    <div v-if="isPending" class="mt-6 flex flex-col gap-3">
      <SkeletonBlock class="h-20 w-40" />
      <SkeletonBlock class="h-4 w-52" />
    </div>
    <div
      v-else-if="current && weather"
      class="mt-6 flex items-center justify-between gap-4"
    >
      <div class="min-w-0">
        <p
          class="m-0 text-7xl leading-none font-light tracking-tighter tabular-nums"
        >
          {{ formatTemperature(current.temperature, units) }}
        </p>
        <p class="m-0 mt-3 font-medium">{{ weather.label }}</p>
        <p class="m-0 mt-1 text-sm text-fg-muted tabular-nums">
          Feels like {{ formatTemperature(current.feelsLike, units) }}
          <template v-if="today">
            · H {{ formatTemperature(today.max, units) }} · L
            {{ formatTemperature(today.min, units) }}
          </template>
        </p>
        <p class="m-0 mt-1 text-xs text-fg-muted tabular-nums">
          {{ formatClock(current.time) }} local time
        </p>
      </div>
      <TIcon
        :icon="weather.icon"
        class="size-20 shrink-0 stroke-1 text-fg-muted"
      />
    </div>
  </TCard>
</template>
