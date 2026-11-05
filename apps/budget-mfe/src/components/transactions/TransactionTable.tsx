import { TButton, TIcon } from '@repo/ui'
import { SearchX, Trash } from '@repo/ui/icons'
import { TDataTable, type TableState, type TableStateKey } from '@repo/ui/table'
import { useCallback, useMemo, useState } from 'react'
import { useDialogActions } from '../../hooks/useDialogs'
import { useFilters } from '../../hooks/useFilters'
import { useTableView } from '../../hooks/useTableView'
import type { Transaction } from '../../types'
import { Message } from '../feedback/Message'
import { createColumns } from './columns'
import { TransactionFilters } from './TransactionFilters'

const getRowId = (transaction: Transaction) => transaction.id
const PAGE_SIZES = { pageSizes: [10, 25, 50, 100] }

/**
 * The transactions of the period, after the filters. The data array comes from a memoised selector, so it
 * keeps its reference until a transaction, the period or a filter changes. Sorting, the page and the visible
 * columns are app state; the selection is this table's own, kept to rows that still exist.
 */
export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const { openDialog } = useDialogActions()
  const filters = useFilters()
  const { view, onViewChange } = useTableView()
  const [rowSelection, setRowSelection] = useState<Record<string, true>>({})

  const columns = useMemo(
    () =>
      createColumns({
        edit: (row) => openDialog({ kind: 'transaction', mode: 'edit', id: row.id }),
        duplicate: (row) => openDialog({ kind: 'transaction', mode: 'duplicate', id: row.id }),
        remove: (row) => openDialog({ kind: 'confirm-delete', ids: [row.id] }),
      }),
    [openDialog],
  )

  // A deleted or filtered-out row leaves the selection, so a bulk delete only ever names visible rows.
  const selection = useMemo(() => {
    const ids = new Set(transactions.map(getRowId))
    const kept = Object.keys(rowSelection).filter((id) => ids.has(id))
    return kept.length === Object.keys(rowSelection).length
      ? rowSelection
      : (Object.fromEntries(kept.map((id) => [id, true])) as Record<string, true>)
  }, [rowSelection, transactions])

  const state = useMemo(() => ({ ...view, rowSelection: selection }), [view, selection])

  const onStateChange = useCallback(
    (next: TableState, changed: TableStateKey[]) => {
      if (changed.includes('rowSelection')) setRowSelection(next.rowSelection)
      onViewChange(next, changed)
    },
    [onViewChange],
  )

  return (
    <TDataTable
      aria-label="Transactions"
      data={transactions}
      columns={columns}
      getRowId={getRowId}
      state={state}
      onStateChange={onStateChange}
      selection="multiple"
      columnsPanel
      pagination={PAGE_SIZES}
      zebra
      renderToolbar={() => <TransactionFilters />}
      renderBulkActions={({ selectedIds }) => (
        <TButton
          variant="danger"
          size="sm"
          onClick={() => openDialog({ kind: 'confirm-delete', ids: selectedIds })}
        >
          <TIcon icon={Trash} size="sm" />
          Delete {selectedIds.length}
        </TButton>
      )}
      renderEmpty={() => (
        <Message
          icon={SearchX}
          title={filters.active ? 'No transactions match' : 'No transactions in this period'}
          action={
            filters.active ? (
              <TButton variant="outline" label="Clear filters" onClick={filters.clear} />
            ) : (
              <TButton
                label="Add a transaction"
                onClick={() => openDialog({ kind: 'transaction', mode: 'new' })}
              />
            )
          }
        >
          {filters.active
            ? 'Try other words, or fewer filters.'
            : 'Pick a longer period at the top, or add one.'}
        </Message>
      )}
    />
  )
}
