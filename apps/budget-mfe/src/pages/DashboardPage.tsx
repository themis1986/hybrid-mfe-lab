import { TGrid } from '@repo/ui'
import { BalanceWidget } from '../components/dashboard/BalanceWidget'
import { BudgetSnapshot } from '../components/dashboard/BudgetSnapshot'
import { CashflowWidget } from '../components/dashboard/CashflowWidget'
import { InsightLine } from '../components/dashboard/InsightLine'
import { KpiCard } from '../components/dashboard/KpiCard'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { SpendingWidget } from '../components/dashboard/SpendingWidget'
import { EmptyLedger } from '../components/feedback/EmptyLedger'
import { useSummary } from '../hooks/useSummary'
import { useTransactions } from '../hooks/useTransactions'

export function DashboardPage() {
  const { kpis } = useSummary()
  const { inPeriod, total } = useTransactions()

  if (total === 0) return <EmptyLedger />

  return (
    <div className="flex flex-col gap-4">
      <section aria-labelledby="budget-key-figures" className="flex flex-col gap-4">
        <h2 id="budget-key-figures" className="sr-only">
          Key figures
        </h2>
        <TGrid minChildWidth="15rem" gap={4}>
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </TGrid>
        <InsightLine />
      </section>
      <TGrid minChildWidth="22rem" gap={4}>
        <CashflowWidget />
        <SpendingWidget />
      </TGrid>
      <TGrid minChildWidth="22rem" gap={4}>
        <BalanceWidget />
        <BudgetSnapshot />
      </TGrid>
      <RecentTransactions transactions={inPeriod} />
    </div>
  )
}
