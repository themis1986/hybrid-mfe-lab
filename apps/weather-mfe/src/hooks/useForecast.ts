import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { fetchForecast } from '../api/openMeteo'
import { useWeatherState } from './useWeatherState'

const TEN_MINUTES = 10 * 60 * 1000
const FIFTEEN_MINUTES = 15 * 60 * 1000

/** The selected place's forecast. While another place loads, the previous data stays up (isPlaceholderData). */
export function useForecast() {
  const { selected } = useWeatherState()

  return useQuery({
    queryKey: [
      'forecast',
      computed(() => selected.value.latitude),
      computed(() => selected.value.longitude),
    ],
    queryFn: ({ signal }) => fetchForecast(selected.value, signal),
    staleTime: TEN_MINUTES,
    refetchInterval: FIFTEEN_MINUTES,
    placeholderData: keepPreviousData,
  })
}
