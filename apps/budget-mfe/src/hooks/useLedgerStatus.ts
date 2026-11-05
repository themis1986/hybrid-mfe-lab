import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { selectLoad } from '../state/selectors'
import { loadLedger } from '../state/thunks'

/** Whether the ledger has loaded, why it failed, and a retry. */
export function useLedgerStatus() {
  const { status, error } = useAppSelector(selectLoad)
  const dispatch = useAppDispatch()
  const retry = useCallback(() => {
    void dispatch(loadLedger())
  }, [dispatch])
  return { status, error, retry }
}
