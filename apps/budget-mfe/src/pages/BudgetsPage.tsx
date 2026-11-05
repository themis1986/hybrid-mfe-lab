import { TGrid } from '@repo/ui'
import { BudgetCard } from '../components/budgets/BudgetCard'
import { MonthStepper } from '../components/budgets/MonthStepper'
import { useBudgets } from '../hooks/useBudgets'
import { formatMoney } from '../lib/money'

export function BudgetsPage() {
  const budgets = useBudgets()
  const { totals } = budgets

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthStepper
          month={budgets.month}
          canGoForward={budgets.canGoForward}
          onPrevious={budgets.previousMonth}
          onNext={budgets.nextMonth}
        />
        <p className="m-0 text-sm text-fg-muted">
          {totals.budgeted > 0
            ? `${formatMoney(totals.spent)} spent of ${formatMoney(totals.budgeted)} budgeted`
            : 'No budgets set yet'}
          {totals.over > 0 &&
            ` · ${totals.over} ${totals.over === 1 ? 'budget' : 'budgets'} over the limit`}
        </p>
      </div>
      <TGrid minChildWidth="16rem" gap={4}>
        {budgets.progress.map((item) => (
          <BudgetCard key={item.category} item={item} />
        ))}
      </TGrid>
    </div>
  )
}
