import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router'
import { EmptyLedger } from '../components/feedback/EmptyLedger'
import { SEARCH_INPUT_ID } from '../components/layout/AppLayout'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { useTransactions } from '../hooks/useTransactions'
import { formatMoney } from '../lib/money'
import { totalsOf } from '../lib/summary'

export function TransactionsPage() {
  const { visible, total } = useTransactions()
  const totals = useMemo(() => totalsOf(visible), [visible])
  const location = useLocation()

  // The "/" shortcut from another page lands here and asks for the search field.
  useEffect(() => {
    if ((location.state as { focusSearch?: boolean } | null)?.focusSearch) {
      document.getElementById(SEARCH_INPUT_ID)?.focus()
    }
  }, [location.state])

  if (total === 0) return <EmptyLedger />

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-sm text-fg-muted" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'transaction' : 'transactions'} · income{' '}
        <span className="text-fg tabular-nums">{formatMoney(totals.income)}</span> · expenses{' '}
        <span className="text-fg tabular-nums">{formatMoney(totals.expenses)}</span>
      </p>
      <TransactionTable transactions={visible} />
    </div>
  )
}
