import { alarm } from '@repo/ui-vue'
import { ref } from 'vue'
import { createPlace } from '../lib/place'
import { useWeatherState } from './useWeatherState'

/** Selects the viewer's position. The browser only asks for permission when `locate` is called. */
export function useGeolocation() {
  const { select } = useWeatherState()
  const isLocating = ref(false)

  function locate() {
    if (!('geolocation' in navigator)) {
      alarm.error('This browser can’t share your location.')
      return
    }
    isLocating.value = true
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        isLocating.value = false
        select(createPlace(coords.latitude, coords.longitude))
      },
      (error) => {
        isLocating.value = false
        alarm.error('Couldn’t get your location', {
          description:
            error.code === error.PERMISSION_DENIED
              ? 'Location access is blocked for this site.'
              : 'Try again, or pick a place on the map.',
        })
      },
      { timeout: 10_000, maximumAge: 300_000 },
    )
  }

  return { isLocating, locate }
}
