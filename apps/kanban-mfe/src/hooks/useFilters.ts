import { useCallback, useState } from 'react'
import { type BoardFilters, NO_FILTERS } from '../lib/filter'

// What the board is narrowed to. Plain view state: it isn't part of the board, so undo never touches it.
export function useFilters() {
  const [filters, setFilters] = useState<BoardFilters>(NO_FILTERS)

  const updateFilters = useCallback((patch: Partial<BoardFilters>) => {
    setFilters((current) => ({ ...current, ...patch }))
  }, [])

  const clearFilters = useCallback(() => setFilters(NO_FILTERS), [])

  return { filters, updateFilters, clearFilters }
}

export type FiltersApi = ReturnType<typeof useFilters>
