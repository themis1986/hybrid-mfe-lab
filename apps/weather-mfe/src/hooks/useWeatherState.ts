import { storeToRefs } from 'pinia'
import { computed, readonly } from 'vue'
import { samePlace } from '../lib/place'
import { useWeatherStore } from '../stores/weather'

/** The app's client state for components: a readonly view of the store plus its actions. */
export function useWeatherState() {
  const store = useWeatherStore()
  const { selected, units, saved } = storeToRefs(store)

  return {
    selected: readonly(selected),
    units: readonly(units),
    saved: readonly(saved),
    isSelectedSaved: computed(() =>
      saved.value.some((place) => samePlace(place, selected.value)),
    ),
    select: store.select,
    setUnits: store.setUnits,
    toggleSaved: store.toggleSaved,
  }
}
