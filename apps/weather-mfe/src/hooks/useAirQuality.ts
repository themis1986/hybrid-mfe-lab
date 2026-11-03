import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { fetchAirQuality } from '../api/openMeteo'
import { useWeatherState } from './useWeatherState'

const TEN_MINUTES = 10 * 60 * 1000
const FIFTEEN_MINUTES = 15 * 60 * 1000

/** The selected place's air quality: a query of its own, so its failure costs one tile, not the forecast. */
export function useAirQuality() {
  const { selected } = useWeatherState()

  return useQuery({
    queryKey: [
      'air-quality',
      computed(() => selected.value.latitude),
      computed(() => selected.value.longitude),
    ],
    queryFn: ({ signal }) => fetchAirQuality(selected.value, signal),
    staleTime: TEN_MINUTES,
    refetchInterval: FIFTEEN_MINUTES,
    placeholderData: keepPreviousData,
  })
}
