import { TPanel } from '@repo/ui'
import { useTransactions } from '../hooks/useTransactions'

export function DashboardPage() {
  const { visible, total } = useTransactions()
  return (
    <TPanel title="Dashboard">
      <span data-testid="counts">
        {visible.length} of {total} transactions in this period
      </span>
    </TPanel>
  )
}
