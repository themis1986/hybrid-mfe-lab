import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_PLACE, samePlace } from '../lib/place'
import type { Place, Units } from '../types'

// Client state only: what the API returns lives in TanStack Query's cache. As with Pinia's other state refs,
// these stay writable here; components go through useWeatherState(), which hands them a readonly view.
export const useWeatherStore = defineStore('weather', () => {
  const selected = ref<Place>(DEFAULT_PLACE)
  const units = ref<Units>('metric')
  const saved = ref<Place[]>([])

  function select(place: Place) {
    selected.value = place
  }

  function setUnits(next: Units) {
    units.value = next
  }

  /** Saves the place, or forgets it if it is already saved. */
  function toggleSaved(place: Place) {
    const others = saved.value.filter((item) => !samePlace(item, place))
    saved.value =
      others.length === saved.value.length ? [...others, place] : others
  }

  return { selected, units, saved, select, setUnits, toggleSaved }
})
