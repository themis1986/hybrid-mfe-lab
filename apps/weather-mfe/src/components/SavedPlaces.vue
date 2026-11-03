<script setup lang="ts">
import { TButton, TIcon } from '@repo/ui-vue'
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
      <TButton
        variant="ghost"
        size="sm"
        :aria-current="samePlace(place, selected)"
        class="gap-1.5 rounded-full ps-3 pe-1 font-normal text-fg active:translate-y-0"
        @click="select(place)"
      >
        <TIcon
          :icon="Star"
          size="sm"
          class="size-3 fill-current text-(--t-amber-9)"
        />
        {{ place.name ?? formatCoordinates(place) }}
      </TButton>
      <TButton
        variant="ghost"
        size="sm"
        :aria-label="`Remove ${place.name ?? formatCoordinates(place)}`"
        class="rounded-full ps-1.5 pe-2 text-fg-muted hover:text-fg active:translate-y-0"
        @click="toggleSaved(place)"
      >
        <TIcon :icon="X" size="sm" class="size-3" />
      </TButton>
    </li>
  </ul>
</template>
