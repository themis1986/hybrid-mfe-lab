import { TPanel } from '@repo/ui'
import { Link } from 'react-router'
import { useDialogs } from '../../hooks/useDialogs'
import { categoryLabel } from '../../lib/categories'
import { formatDayMonth } from '../../lib/dates'
import { formatSignedMoney } from '../../lib/money'
import { PATHS } from '../../paths'
import type { Transaction } from '../../types'
import { CategoryIcon } from '../common/CategoryIcon'

/** The latest transactions of the period. Each opens the edit dialog. */
export function RecentTransactions({
  transactions,
  limit = 6,
}: {
  transactions: readonly Transaction[]
  limit?: number
}) {
  const { openDialog } = useDialogs()
  const shown = transactions.slice(0, limit)

  return (
    <TPanel title="Recent transactions">
      {shown.length === 0 ? (
        <p className="m-0 text-sm text-fg-muted">
          Nothing in this period yet.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {shown.map((transaction) => (
            <li key={transaction.id}>
              <button
                type="button"
                className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent px-2 py-2 text-start font-sans text-fg transition-colors duration-150 hover:bg-accent-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                onClick={() =>
                  openDialog({
                    kind: 'transaction',
                    mode: 'edit',
                    id: transaction.id,
                  })
                }
              >
                <CategoryIcon category={transaction.category} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {transaction.description}
                  </span>
                  <span className="truncate text-xs text-fg-muted">
                    {categoryLabel(transaction.category)} ·{' '}
                    {formatDayMonth(transaction.date)}
                  </span>
                </span>
                <span
                  className={`text-sm font-medium whitespace-nowrap tabular-nums ${transaction.type === 'income' ? 'text-success-fg' : 'text-fg'}`}
                >
                  {formatSignedMoney(
                    transaction.type === 'income'
                      ? transaction.amount
                      : -transaction.amount,
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link
        to={PATHS.transactions}
        className="mt-2 inline-block text-sm text-accent-fg underline-offset-2 hover:underline"
      >
        All transactions
      </Link>
    </TPanel>
  )
}
