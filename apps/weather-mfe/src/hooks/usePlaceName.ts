import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { reversePlaceName } from '../api/mapbox'
import { formatCoordinates } from '../lib/place'
import { useWeatherState } from './useWeatherState'

/**
 * What to call the selected place: its own name (a search result), else its name from Mapbox, else its
 * coordinates (no token, a refused request, or open water).
 *
 * Mapbox's temporary results may not be cached or stored, so this one query is removed as soon as nothing
 * shows it (`gcTime: 0`), and its result never reaches the store: a saved clicked point keeps only its
 * coordinates, and is looked up again when selected.
 */
export function usePlaceName() {
  const { selected } = useWeatherState()
  const token = import.meta.env.VITE_MAPBOX_TOKEN

  const { data } = useQuery({
    queryKey: [
      'place-name',
      computed(() => selected.value.latitude),
      computed(() => selected.value.longitude),
    ],
    queryFn: ({ signal }) => reversePlaceName(selected.value, token!, signal),
    enabled: computed(() => Boolean(token) && !selected.value.name),
    gcTime: 0,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const name = computed(
    () =>
      selected.value.name ??
      data.value?.name ??
      formatCoordinates(selected.value),
  )
  const region = computed(() =>
    selected.value.name ? selected.value.region : data.value?.region,
  )

  return { name, region }
}
