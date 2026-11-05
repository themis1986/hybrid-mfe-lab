import { TBadge, TIcon } from '@repo/ui'
import { Copy, Pencil, Trash } from '@repo/ui/icons'
import type { TDataTableColumn } from '@repo/ui/table'
import { CATEGORIES, categoryLabel } from '../../lib/categories'
import { formatSignedMoney } from '../../lib/money'
import type { Transaction } from '../../types'
import { CATEGORY_ICONS, CHART_TEXT_CLASSES } from '../common/categoryIcons'

export interface RowActions {
  edit(transaction: Transaction): void
  duplicate(transaction: Transaction): void
  remove(transaction: Transaction): void
}

/** Income positive, expenses negative: the amount column sorts and reads by its sign. */
export const signedAmount = (transaction: Transaction) =>
  transaction.type === 'income' ? transaction.amount : -transaction.amount

/**
 * The transactions table's columns. Built once per set of actions (which never change), since a new array
 * rebuilds the engine's columns. Renderers follow the table's rules: one static class per cell, and any
 * control in a cell takes the tabIndex the table gives it.
 */
export function createColumns(actions: RowActions): TDataTableColumn<Transaction>[] {
  return [
    {
      accessorKey: 'date',
      title: 'Date',
      type: 'date',
      width: 130,
      date: { dateStyle: 'medium' },
      hideable: false,
    },
    {
      accessorKey: 'description',
      title: 'Description',
      width: 280,
      hideable: false,
      cell: ({ value }) => <span className="block truncate">{value}</span>,
    },
    {
      accessorKey: 'category',
      title: 'Category',
      width: 170,
      sortFn: (a, b) => categoryLabel(a.category).localeCompare(categoryLabel(b.category)),
      cell: ({ row }) => (
        <TBadge>
          <TIcon
            icon={CATEGORY_ICONS[row.category]}
            size="sm"
            className={CHART_TEXT_CLASSES[CATEGORIES[row.category].color]}
          />
          {categoryLabel(row.category)}
        </TBadge>
      ),
    },
    {
      accessorKey: 'type',
      title: 'Type',
      type: 'badge',
      width: 110,
      badge: {
        tones: { income: 'accent', expense: 'neutral' },
        labels: { income: 'Income', expense: 'Expense' },
      },
    },
    {
      id: 'amount',
      accessorFn: signedAmount,
      title: 'Amount',
      align: 'end',
      width: 140,
      hideable: false,
      // The sign is in the text, so the colour is never the only signal.
      cell: ({ value }) => (
        <span
          className={`font-medium tabular-nums ${value > 0 ? 'text-success-fg' : 'text-danger-fg'}`}
        >
          {formatSignedMoney(value)}
        </span>
      ),
    },
    {
      accessorKey: 'notes',
      title: 'Notes',
      width: 240,
      sortable: false,
      cell: ({ value }) => (
        <span className="block truncate text-fg-muted">{value ?? ''}</span>
      ),
    },
    {
      id: 'actions',
      title: 'Actions',
      type: 'actions',
      width: 64,
      align: 'end',
      hideable: false,
      actions: (row) => [
        { id: 'edit', label: 'Edit', icon: Pencil, onSelect: () => actions.edit(row) },
        {
          id: 'duplicate',
          label: 'Duplicate',
          icon: Copy,
          onSelect: () => actions.duplicate(row),
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: Trash,
          tone: 'danger',
          onSelect: () => actions.remove(row),
        },
      ],
    },
  ]
}
