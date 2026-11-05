import { TIcon } from '@repo/ui'
import { Sparkles } from '@repo/ui/icons'
import { useSummary } from '../../hooks/useSummary'
import { CATEGORIES } from '../../lib/categories'
import { formatPercent } from '../../lib/format'
import { formatMoney } from '../../lib/money'

function changeText(change: number | null): string {
  if (change === null) return ', with nothing there in the previous period'
  if (Math.abs(change) < 0.005) return ', the same as the previous period'
  return `, ${change > 0 ? 'up' : 'down'} ${formatPercent(Math.abs(change))} on the previous period`
}

/** One sentence about where the money went. */
export function InsightLine() {
  const { topSpending: top } = useSummary()
  if (!top) return null
  return (
    <p className="m-0 flex items-start gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-fg">
      <TIcon icon={Sparkles} size="sm" className="mt-0.5 text-accent-fg" />
      <span>
        <strong className="font-semibold">{CATEGORIES[top.category].label}</strong> was your top
        spending: {formatMoney(top.amount)}, {formatPercent(top.share)} of expenses
        {changeText(top.change)}.
      </span>
    </p>
  )
}
