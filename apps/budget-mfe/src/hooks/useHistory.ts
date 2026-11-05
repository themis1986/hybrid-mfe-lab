import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { selectCanRedo, selectCanUndo } from '../state/selectors'
import { redo, undo } from '../state/undo'

/** Undo and redo over transactions and budgets, and whether each can run. */
export function useHistory() {
  const canUndo = useAppSelector(selectCanUndo)
  const canRedo = useAppSelector(selectCanRedo)
  const dispatch = useAppDispatch()
  const actions = useMemo(
    () => ({
      undo: () => {
        dispatch(undo())
      },
      redo: () => {
        dispatch(redo())
      },
    }),
    [dispatch],
  )
  return { canUndo, canRedo, ...actions }
}
