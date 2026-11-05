import type { TableState, TableStateKey } from '@repo/ui/table'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { selectTableView } from '../state/selectors'
import { type TableView, tableViewChanged } from '../state/ui'

const VIEW_KEYS = ['sorting', 'pagination', 'columnVisibility'] as const

/**
 * The table slices the app keeps (sort, page, visible columns), so they survive a visit to another page,
 * and the handler that takes the table's changes to them.
 */
export function useTableView() {
  const view = useAppSelector(selectTableView)
  const dispatch = useAppDispatch()

  const onViewChange = useCallback(
    (state: TableState, changed: TableStateKey[]) => {
      const patch: Partial<TableView> = {}
      for (const key of VIEW_KEYS) {
        if (changed.includes(key)) Object.assign(patch, { [key]: state[key] })
      }
      if (Object.keys(patch).length > 0) dispatch(tableViewChanged(patch))
    },
    [dispatch],
  )

  return { view, onViewChange }
}
