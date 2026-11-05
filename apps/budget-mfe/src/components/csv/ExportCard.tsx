import { TButton, TCard, TFormField, TIcon, TRadioGroup, TRadioGroupItem } from '@repo/ui'
import { Download } from '@repo/ui/icons'
import { useState } from 'react'
import { useCsvExport } from '../../hooks/useCsv'
import { CSV_COLUMNS } from '../../lib/schemas'

function plural(count: number) {
  return `${count} ${count === 1 ? 'transaction' : 'transactions'}`
}

/** Downloads the current view or everything as a CSV file, which is also how data outlives a session. */
export function ExportCard() {
  const csv = useCsvExport()
  const [scope, setScope] = useState<'view' | 'all'>('view')
  const count = scope === 'view' ? csv.viewCount : csv.allCount

  return (
    <TCard variant="elevated" className="min-w-0">
      <h2 className="m-0 text-base font-semibold text-fg">Export</h2>
      <p className="m-0 text-sm text-fg-muted">
        Nothing is saved when you leave: export a CSV file to keep your data, and import it next time.
      </p>
      <TFormField label="What to export">
        {({ id, labelId }) => (
          <TRadioGroup
            id={id}
            aria-labelledby={labelId}
            value={scope}
            onValueChange={(value) => setScope(value as 'view' | 'all')}
          >
            <label className="inline-flex items-center gap-2 text-sm text-fg">
              <TRadioGroupItem value="view" />
              The current view: the period and filters ({plural(csv.viewCount)})
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-fg">
              <TRadioGroupItem value="all" />
              Everything ({plural(csv.allCount)})
            </label>
          </TRadioGroup>
        )}
      </TFormField>
      <div className="flex flex-wrap items-center gap-3">
        <TButton
          disabled={count === 0}
          onClick={scope === 'view' ? csv.exportView : csv.exportAll}
        >
          <TIcon icon={Download} size="sm" />
          Download CSV
        </TButton>
        <span className="text-xs text-fg-muted">
          UTF-8, readable by Excel. Columns: {CSV_COLUMNS.join(', ')}.
        </span>
      </div>
    </TCard>
  )
}
