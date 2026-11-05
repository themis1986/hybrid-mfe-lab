import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { useTransactions } from '../hooks/useTransactions'

export function DashboardPage() {
  const { inPeriod, total } = useTransactions()
  return (
    <div className="flex flex-col gap-4">
      <p className="m-0 text-sm text-fg-muted" data-testid="counts">
        {inPeriod.length} of {total} transactions in this period
      </p>
      <RecentTransactions transactions={inPeriod} />
    </div>
  )
}
