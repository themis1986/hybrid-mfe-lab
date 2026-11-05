import { TWidget } from '@repo/ui'
import { type ChartPointEvent, TChart } from '@repo/ui/charts'
import { useSummary } from '../../hooks/useSummary'
import { CATEGORIES } from '../../lib/categories'
import { formatPercent } from '../../lib/format'
import { formatMoney, sumAmounts } from '../../lib/money'
import { CategoryIcon } from '../common/CategoryIcon'
import { DONUT_OPTIONS } from './charts'

const sliceTooltip = (point: ChartPointEvent) =>
  `${point.category ?? ''}: <b>${formatMoney(point.value ?? 0)}</b> (${formatPercent((point.percentage ?? 0) / 100)})`

/**
 * Expenses by category: a donut for the part-to-whole picture, and the ranked list beside it for reading
 * and comparing the amounts (a donut alone is poor at close values). The list is also the legend.
 */
export function SpendingWidget() {
  const { spending, spendingChart } = useSummary()
  const total = sumAmounts(spending.map((spend) => spend.amount))

  return (
    <TWidget title="Spending by category" headingLevel={2} className="min-w-0">
      {spending.length === 0 ? (
        <p className="m-0 py-10 text-center text-sm text-fg-muted">
          No spending in this period.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative mx-auto size-52 shrink-0">
            <TChart
              type="pie"
              series={spendingChart.series}
              colors={spendingChart.colors}
              legend={false}
              tooltip={sliceTooltip}
              options={DONUT_OPTIONS}
              ariaLabel="Spending by category"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="text-xs text-fg-muted">Spent</span>
              <span className="text-base font-semibold text-fg tabular-nums">
                {formatMoney(total)}
              </span>
            </div>
          </div>
          <ol className="m-0 flex min-w-[min(100%,14rem)] flex-1 list-none flex-col gap-2 p-0">
            {spending.map((spend) => (
              <li key={spend.category} className="flex items-center gap-2 text-sm">
                <CategoryIcon category={spend.category} size="sm" />
                <span className="min-w-0 flex-1 truncate text-fg">
                  {CATEGORIES[spend.category].label}
                </span>
                <span className="text-fg tabular-nums">{formatMoney(spend.amount)}</span>
                <span className="w-10 text-end text-xs text-fg-muted tabular-nums">
                  {formatPercent(spend.share)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </TWidget>
  )
}
