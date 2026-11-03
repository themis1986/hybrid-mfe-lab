import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed, onScopeDispose, ref, watch } from 'vue'
import { searchPlaces } from '../api/openMeteo'

const DEBOUNCE_MS = 300
const MIN_LENGTH = 2
const ONE_HOUR = 60 * 60 * 1000

/** City search: `query` is the typed text; the request follows once typing pauses. */
export function usePlaceSearch() {
  const query = ref('')
  const settled = ref('')

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(query, (text) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      settled.value = text.trim()
    }, DEBOUNCE_MS)
  })
  onScopeDispose(() => clearTimeout(timer))

  const isSearchable = computed(() => query.value.trim().length >= MIN_LENGTH)

  const { data, isFetching, isError } = useQuery({
    queryKey: ['place-search', settled],
    queryFn: ({ signal }) => searchPlaces(settled.value, signal),
    enabled: computed(() => settled.value.length >= MIN_LENGTH),
    staleTime: ONE_HOUR,
    placeholderData: keepPreviousData,
  })

  return {
    query,
    results: computed(() => (isSearchable.value ? (data.value ?? []) : [])),
    isSearchable,
    // Includes the debounce, so "nothing found" can't show for text that hasn't been searched yet.
    isSearching: computed(
      () =>
        isSearchable.value &&
        (isFetching.value || settled.value !== query.value.trim()),
    ),
    isError,
  }
}
