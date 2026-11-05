import { useMemo } from 'react'
import { ledgerCleared } from '../state/actions'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import {
  selectPeriodTransactions,
  selectTransactionById,
  selectTransactionCount,
  selectVisibleTransactions,
} from '../state/selectors'
import { added, removed, updated } from '../state/transactions'
import type { TransactionId, TransactionInput } from '../types'

/** The transactions the current period and filters let through, those in the period, and the total count. */
export function useTransactions() {
  const visible = useAppSelector(selectVisibleTransactions)
  const inPeriod = useAppSelector(selectPeriodTransactions)
  const total = useAppSelector(selectTransactionCount)
  return { visible, inPeriod, total }
}

/** One transaction by id, or undefined (also for a null id). */
export function useTransaction(id: TransactionId | null) {
  return useAppSelector((state) =>
    id === null ? undefined : selectTransactionById(state, id),
  )
}

/** What can be done to transactions. Each call is one undo step. */
export function useTransactionActions() {
  const dispatch = useAppDispatch()
  return useMemo(
    () => ({
      add: (input: TransactionInput) => {
        dispatch(added(input))
      },
      update: (id: TransactionId, input: TransactionInput) => {
        dispatch(updated({ id, input }))
      },
      remove: (ids: TransactionId[]) => {
        dispatch(removed(ids))
      },
      /** Every transaction and budget: "Clear data". */
      clearAll: () => {
        dispatch(ledgerCleared())
      },
    }),
    [dispatch],
  )
}
