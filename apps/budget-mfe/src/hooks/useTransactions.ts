import { useAppSelector } from '../state/hooks'
import {
  selectTransactionCount,
  selectVisibleTransactions,
} from '../state/selectors'

/** The transactions the current period and filters let through, and how many there are in all. */
export function useTransactions() {
  const visible = useAppSelector(selectVisibleTransactions)
  const total = useAppSelector(selectTransactionCount)
  return { visible, total }
}
