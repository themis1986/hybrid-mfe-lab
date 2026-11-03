<script setup lang="ts">
import { TButton, TIcon, TSpinner } from '@repo/ui-vue'
import { LocateFixed } from '@repo/ui-vue/icons'
import { defineAsyncComponent } from 'vue'
import CurrentCard from '../components/CurrentCard.vue'
import DailyForecast from '../components/DailyForecast.vue'
import MetricsGrid from '../components/MetricsGrid.vue'
import PlaceSearch from '../components/PlaceSearch.vue'
import SavedPlaces from '../components/SavedPlaces.vue'
import SkeletonBlock from '../components/SkeletonBlock.vue'
import UnitsToggle from '../components/UnitsToggle.vue'
import { useGeolocation } from '../hooks/useGeolocation'

// The map and chart engines are heavy: each downloads only with its component.
const WeatherMap = defineAsyncComponent({
  loader: () => import('../components/WeatherMap.vue'),
  loadingComponent: SkeletonBlock,
})
const HourlyChart = defineAsyncComponent({
  loader: () => import('../components/HourlyChart.vue'),
  loadingComponent: SkeletonBlock,
})

const { isLocating, locate } = useGeolocation()
</script>

<template>
  <!-- A container, not the viewport, decides the layout: the shell's sidebar takes part of the viewport's width. -->
  <div class="@container isolate font-sans text-fg">
    <div
      class="mx-auto box-border flex max-w-(--t-container-lg) flex-col gap-4 p-4 @3xl:p-6"
    >
      <h1 class="sr-only">Weather</h1>

      <div
        class="grid grid-cols-[minmax(0,1fr)] gap-4 @4xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
      >
        <div
          class="relative h-[clamp(24rem,60vh,40rem)] @4xl:h-auto @4xl:min-h-full"
        >
          <div
            class="absolute inset-0 overflow-hidden rounded-lg border border-line bg-surface"
          >
            <WeatherMap class="size-full" />
          </div>
          <!-- Floats over the map, outside its clipped box: the search results may run past the map's edge. -->
          <div
            class="absolute inset-x-3 top-3 z-10 box-border flex flex-wrap items-center gap-2 rounded-lg border border-line bg-canvas/75 p-2 shadow-lg backdrop-blur-md"
          >
            <PlaceSearch />
            <TButton
              variant="ghost"
              size="sm"
              :disabled="isLocating"
              aria-label="Use my location"
              @click="locate"
            >
              <TSpinner v-if="isLocating" size="sm" label="Locating" />
              <TIcon v-else :icon="LocateFixed" size="sm" />
            </TButton>
            <UnitsToggle />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-4">
          <CurrentCard />
          <MetricsGrid />
        </div>
      </div>

      <SavedPlaces />

      <div
        class="grid grid-cols-[minmax(0,1fr)] gap-4 @4xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
      >
        <HourlyChart />
        <DailyForecast />
      </div>

      <footer class="text-xs text-fg-muted">
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          class="text-inherit underline"
          >Weather data by Open-Meteo.com</a
        >, licensed under
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
          class="text-inherit underline"
          >CC BY 4.0</a
        >.
      </footer>
    </div>
  </div>
</template>
