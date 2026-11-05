import { TIcon, TProgress } from '@repo/ui'
import { CircleAlert } from '@repo/ui/icons'
import type { BudgetProgress } from '../../lib/budgets'
import { CATEGORIES } from '../../lib/categories'
import { formatPercent } from '../../lib/format'
import { formatMoney } from '../../lib/money'
import { CategoryIcon } from '../common/CategoryIcon'

/** The status in words, so the bar's colour is never the only signal. */
export function budgetStatusText(item: BudgetProgress): string {
  if (item.limit === null || item.ratio === null || item.remaining === null) {
    return 'No budget'
  }
  if (item.remaining < 0) return `${formatMoney(-item.remaining)} over`
  return `${formatPercent(item.ratio)} used · ${formatMoney(item.remaining)} left`
}

/** A category's spending against its limit: name, amounts, a bar in the status colour and the status in words. */
export function BudgetMeter({ item }: { item: BudgetProgress }) {
  const label = CATEGORIES[item.category].label
  const over = item.tone === 'danger'

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <CategoryIcon category={item.category} size="sm" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{label}</span>
        <span className="text-sm whitespace-nowrap text-fg tabular-nums">
          {formatMoney(item.spent)}
          {item.limit !== null && (
            <span className="text-fg-muted"> of {formatMoney(item.limit)}</span>
          )}
        </span>
      </div>
      {item.limit !== null && item.ratio !== null && item.tone !== null && (
        <>
          <TProgress
            value={Math.min(100, Math.round(item.ratio * 100))}
            tone={item.tone}
            aria-label={`${label} budget`}
            getValueLabel={() => budgetStatusText(item)}
          />
          <p
            className={`m-0 flex items-center gap-1 text-xs ${over ? 'font-medium text-danger-fg' : 'text-fg-muted'}`}
          >
            {over && <TIcon icon={CircleAlert} size="sm" />}
            {budgetStatusText(item)}
          </p>
        </>
      )}
    </div>
  )
}
