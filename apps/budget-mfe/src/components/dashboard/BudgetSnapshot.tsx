import { TPanel } from '@repo/ui'
import { Link } from 'react-router'
import { useBudgets } from '../../hooks/useBudgets'
import { formatMonth } from '../../lib/dates'
import { PATHS } from '../../paths'
import { BudgetMeter } from '../budgets/BudgetMeter'

/** The budgets closest to their limit this month, most at risk first. */
export function BudgetSnapshot({ limit = 4 }: { limit?: number }) {
  const { month, progress } = useBudgets()
  const shown = progress
    .filter((item) => item.ratio !== null)
    .sort((a, b) => (b.ratio ?? 0) - (a.ratio ?? 0))
    .slice(0, limit)

  return (
    <TPanel title={`Budgets · ${formatMonth(month)}`}>
      {shown.length === 0 ? (
        <p className="m-0 text-sm text-fg-muted">No budgets set.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {shown.map((item) => (
            <li key={item.category}>
              <BudgetMeter item={item} />
            </li>
          ))}
        </ul>
      )}
      <Link
        to={PATHS.budgets}
        className="mt-3 inline-block text-sm text-accent-fg underline-offset-2 hover:underline"
      >
        All budgets
      </Link>
    </TPanel>
  )
}
