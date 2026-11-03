<script setup lang="ts">
import { TIcon, TInput, TSpinner } from '@repo/ui-vue'
import { Search } from '@repo/ui-vue/icons'
import { computed, ref, useId, watch } from 'vue'
import { usePlaceSearch } from '../hooks/usePlaceSearch'
import { useWeatherState } from '../hooks/useWeatherState'
import type { Place } from '../types'

// A combobox on TInput rather than TCombobox: that one filters its options by label, which would hide valid
// results here (typing "Munchen" finds "Munich"), since the API has already done the matching.
const { select } = useWeatherState()
const { query, results, isSearchable, isSearching, isError } = usePlaceSearch()

const listId = useId()
const open = ref(false)
const active = ref(0)

watch(results, () => {
  active.value = 0
})

const showList = computed(() => open.value && isSearchable.value)
const optionId = (index: number) => `${listId}-${index}`

function pick(place: Place) {
  select(place)
  query.value = ''
  open.value = false
}

function move(step: number) {
  const count = results.value.length
  if (count) active.value = (active.value + step + count) % count
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    open.value = true
    move(event.key === 'ArrowDown' ? 1 : -1)
    return
  }
  if (event.key === 'Enter' && showList.value) {
    event.preventDefault()
    const place = results.value[active.value]
    if (place) pick(place)
  }
}
</script>

<template>
  <div class="relative min-w-40 flex-1">
    <TIcon
      :icon="Search"
      size="sm"
      class="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-fg-muted"
    />
    <TInput
      v-model="query"
      size="sm"
      type="search"
      role="combobox"
      autocomplete="off"
      placeholder="Search for a city"
      aria-label="Search for a city"
      aria-autocomplete="list"
      :aria-expanded="showList"
      :aria-controls="showList ? listId : undefined"
      :aria-activedescendant="
        showList && results.length ? optionId(active) : undefined
      "
      class="w-full ps-9"
      @focus="open = true"
      @blur="open = false"
      @input="open = true"
      @keydown="onKeydown"
    />
    <TSpinner
      v-if="isSearching"
      size="sm"
      label="Searching"
      class="absolute end-3 top-1/2 -translate-y-1/2 text-fg-muted"
    />

    <div
      v-if="showList"
      class="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-line bg-canvas shadow-lg"
    >
      <!-- mousedown keeps the focus in the input, so its blur doesn't close the list before the click lands. -->
      <ul
        v-if="results.length"
        :id="listId"
        role="listbox"
        aria-label="Cities"
        class="m-0 list-none p-1"
        @mousedown.prevent
      >
        <li
          v-for="(place, index) in results"
          :id="optionId(index)"
          :key="`${place.latitude},${place.longitude}`"
          role="option"
          :aria-selected="index === active"
          class="box-border cursor-pointer rounded-md px-3 py-2 text-sm aria-selected:bg-accent-subtle"
          @click="pick(place)"
          @mouseenter="active = index"
        >
          <span class="font-medium">{{ place.name }}</span>
          <span v-if="place.region" class="block text-xs text-fg-muted">
            {{ place.region }}
          </span>
        </li>
      </ul>
      <p v-else-if="isError" class="m-0 p-3 text-sm text-fg-muted">
        The search isn’t available right now.
      </p>
      <p v-else-if="!isSearching" class="m-0 p-3 text-sm text-fg-muted">
        No places found.
      </p>
      <p v-else class="m-0 p-3 text-sm text-fg-muted">Searching…</p>
    </div>
  </div>
</template>
