import { TBadge, TButton, TCard, TSelect } from '@repo/ui'
import { TDataTable, type TDataTableColumn } from '@repo/ui/table'
import { useMemo, useState } from 'react'
import type { ImportPreview as Preview, PreviewRow, RowStatus } from '../../lib/transactionsCsv'

const COLUMNS: TDataTableColumn<PreviewRow>[] = [
  { accessorKey: 'row', title: 'Row', type: 'number', width: 76 },
  {
    accessorKey: 'status',
    title: 'Status',
    type: 'badge',
    width: 116,
    badge: {
      tones: { valid: 'success', duplicate: 'warning', invalid: 'danger' },
      labels: { valid: 'Valid', duplicate: 'Duplicate', invalid: 'Invalid' },
    },
  },
  { id: 'date', accessorFn: (row) => row.text.date ?? '', title: 'Date', width: 120 },
  { id: 'type', accessorFn: (row) => row.text.type ?? '', title: 'Type', width: 100 },
  {
    id: 'amount',
    accessorFn: (row) => row.text.amount ?? '',
    title: 'Amount',
    width: 110,
    align: 'end',
  },
  { id: 'category', accessorFn: (row) => row.text.category ?? '', title: 'Category', width: 140 },
  {
    id: 'description',
    accessorFn: (row) => row.text.description ?? '',
    title: 'Description',
    width: 220,
    cell: ({ value }) => <span className="block truncate">{value}</span>,
  },
  {
    id: 'problems',
    accessorFn: (row) => row.problems.join(' · '),
    title: 'Problems',
    width: 380,
    sortable: false,
    cell: ({ row }) => (
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-sm whitespace-normal">
        {row.problems.map((problem) => (
          <li
            key={problem}
            className={row.status === 'invalid' ? 'text-danger-fg' : 'text-fg-muted'}
          >
            {problem}
          </li>
        ))}
      </ul>
    ),
  },
]

const getRowId = (row: PreviewRow) => String(row.row)

// A large file renders only the rows in view. A small one renders them all, so rows with several problems
// (taller than the estimate) are sized exactly; the scroller is bounded either way.
const VIRTUAL_FROM = 200
const VIRTUAL = { estimateRowHeight: 52 }
const SHOW_OPTIONS = [
  { value: 'all', label: 'All rows' },
  { value: 'invalid', label: 'Invalid' },
  { value: 'duplicate', label: 'Duplicates' },
  { value: 'valid', label: 'Valid' },
]

/** Every row of the file with its status and, for the rest, why it won't be imported. */
export function ImportPreview({
  fileName,
  preview,
  onImport,
  onCancel,
}: {
  fileName: string
  preview: Preview
  onImport(): void
  onCancel(): void
}) {
  const [show, setShow] = useState<'all' | RowStatus>(
    preview.counts.invalid > 0 ? 'invalid' : 'all',
  )
  const rows = useMemo(
    () => (show === 'all' ? preview.rows : preview.rows.filter((row) => row.status === show)),
    [preview.rows, show],
  )
  const { valid, duplicate, invalid } = preview.counts

  return (
    <TCard variant="elevated" className="min-w-0" asChild>
      <section aria-labelledby="budget-import-preview">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id="budget-import-preview" className="m-0 text-base font-semibold text-fg">
            Check {fileName}
          </h2>
          <p className="m-0 flex flex-wrap items-center gap-2 text-sm text-fg-muted" aria-live="polite">
            <TBadge tone="success" size="md">{valid} valid</TBadge>
            <TBadge tone="warning" size="md">{duplicate} duplicate</TBadge>
            <TBadge tone="danger" size="md">{invalid} invalid</TBadge>
            Only valid rows are imported; duplicates and invalid rows are skipped.
          </p>
          {preview.ignoredColumns.length > 0 && (
            <p className="m-0 text-xs text-fg-muted">
              Not read: {preview.ignoredColumns.join(', ')} (not a column of the format).
            </p>
          )}
        </div>
        <TSelect
          size="sm"
          aria-label="Show"
          className="w-40"
          options={SHOW_OPTIONS}
          value={show}
          onValueChange={(value) => setShow(value as 'all' | RowStatus)}
        />
      </div>
      <TDataTable
        aria-label={`Rows of ${fileName}`}
        data={rows}
        columns={COLUMNS}
        getRowId={getRowId}
        pagination={false}
        virtualized={rows.length > VIRTUAL_FROM ? VIRTUAL : false}
        maxHeight={420}
        density="compact"
        renderEmpty={() => <p className="m-0 p-4 text-sm text-fg-muted">No rows to show.</p>}
      />
      <div className="flex flex-wrap justify-end gap-2">
        <TButton variant="ghost" label="Cancel" onClick={onCancel} />
        <TButton
          disabled={valid === 0}
          label={valid === 0 ? 'Nothing to import' : `Import ${valid} ${valid === 1 ? 'row' : 'rows'}`}
          onClick={onImport}
        />
      </div>
      </section>
    </TCard>
  )
}
