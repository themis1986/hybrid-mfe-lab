<script setup lang="ts">
import { TIcon } from '@repo/ui-vue'
import { Star, X } from '@repo/ui-vue/icons'
import { useWeatherState } from '../hooks/useWeatherState'
import { formatCoordinates, samePlace } from '../lib/place'

// In memory only, for now (see the README's roadmap). A saved clicked point shows its coordinates: Mapbox's
// names may not be stored, so it gets its name again when selected.
const { selected, saved, select, toggleSaved } = useWeatherState()
</script>

<template>
  <ul
    v-if="saved.length"
    aria-label="Saved places"
    class="m-0 flex list-none flex-wrap gap-2 p-0"
  >
    <li
      v-for="place in saved"
      :key="`${place.latitude},${place.longitude}`"
      class="flex items-center rounded-full border border-line bg-surface text-sm has-aria-[current=true]:border-accent-line has-aria-[current=true]:bg-accent-subtle"
    >
      <button
        type="button"
        :aria-current="samePlace(place, selected)"
        class="flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent py-1.5 ps-3 pe-1 font-sans text-sm text-fg"
        @click="select(place)"
      >
        <TIcon
          :icon="Star"
          size="sm"
          class="size-3 fill-current text-(--t-amber-9)"
        />
        {{ place.name ?? formatCoordinates(place) }}
      </button>
      <button
        type="button"
        :aria-label="`Remove ${place.name ?? formatCoordinates(place)}`"
        class="flex cursor-pointer items-center rounded-full border-0 bg-transparent py-1.5 ps-1 pe-2 text-fg-muted hover:text-fg"
        @click="toggleSaved(place)"
      >
        <TIcon :icon="X" size="sm" class="size-3" />
      </button>
    </li>
  </ul>
</template>
