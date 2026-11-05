import { TButton, TCard } from '@repo/ui'
import { useDialogs } from '../../hooks/useDialogs'
import type { BudgetProgress } from '../../lib/budgets'
import { CATEGORIES } from '../../lib/categories'
import { BudgetMeter } from './BudgetMeter'

/** One category on the budgets page: its meter, and the button that sets or changes its limit. */
export function BudgetCard({ item }: { item: BudgetProgress }) {
  const { openDialog } = useDialogs()
  const label = CATEGORIES[item.category].label

  return (
    <TCard variant="elevated" className="min-w-0 justify-between">
      <BudgetMeter item={item} />
      {item.limit === null && (
        <p className="m-0 text-xs text-fg-muted">No monthly limit set.</p>
      )}
      <div>
        <TButton
          variant={item.limit === null ? 'soft' : 'ghost'}
          size="sm"
          aria-label={`${item.limit === null ? 'Set a budget for' : 'Edit the budget for'} ${label}`}
          onClick={() => openDialog({ kind: 'budget', category: item.category })}
        >
          {item.limit === null ? 'Set budget' : 'Edit budget'}
        </TButton>
      </div>
    </TCard>
  )
}
