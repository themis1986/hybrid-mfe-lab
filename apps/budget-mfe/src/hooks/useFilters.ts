import { useMemo } from 'react'
import { isFiltering, type TransactionFilters } from '../lib/filter'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { selectFilters } from '../state/selectors'
import {
  categoryFilterChanged,
  filtersCleared,
  queryChanged,
  typeFilterChanged,
} from '../state/ui'
import type { CategoryId } from '../types'

/** The transactions view's filters and the actions that change them. Each change shows the first page. */
export function useFilters() {
  const filters = useAppSelector(selectFilters)
  const dispatch = useAppDispatch()
  const actions = useMemo(
    () => ({
      setQuery: (query: string) => {
        dispatch(queryChanged(query))
      },
      setType: (type: TransactionFilters['type']) => {
        dispatch(typeFilterChanged(type))
      },
      setCategories: (categories: CategoryId[]) => {
        dispatch(categoryFilterChanged(categories))
      },
      clear: () => {
        dispatch(filtersCleared())
      },
    }),
    [dispatch],
  )
  return { filters, active: isFiltering(filters), ...actions }
}
