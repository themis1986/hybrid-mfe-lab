import { formatBytes, TButton, TCard, TIcon, TUpload } from '@repo/ui'
import { FileSpreadsheet } from '@repo/ui/icons'
import { type ImportState, useCsvExport } from '../../hooks/useCsv'
import { MAX_FILE_BYTES, MAX_ROWS } from '../../lib/transactionsCsv'

/** Takes one CSV file. Reading it only builds the preview below: nothing is added until it is confirmed. */
export function ImportCard({
  files,
  state,
  onChoose,
}: {
  files: File[]
  state: ImportState
  onChoose(files: File[]): void
}) {
  const { downloadTemplate } = useCsvExport()

  return (
    <TCard variant="elevated" className="min-w-0">
      <h2 className="m-0 text-base font-semibold text-fg">Import</h2>
      <TUpload
        label="CSV file"
        accept={['.csv', 'text/csv']}
        maxSize={MAX_FILE_BYTES}
        value={files}
        onValueChange={onChoose}
        description={`A header row, then one transaction per row. Up to ${formatBytes(MAX_FILE_BYTES)} and ${MAX_ROWS.toLocaleString()} rows; commas or semicolons.`}
        error={state.status === 'error' ? state.message : undefined}
        dropLabel="Drop a CSV file here, or"
        browseLabel="choose one"
      />
      {state.status === 'reading' && (
        <p role="status" className="m-0 text-sm text-fg-muted">
          Reading {state.fileName}…
        </p>
      )}
      <div>
        <TButton variant="ghost" size="sm" onClick={downloadTemplate}>
          <TIcon icon={FileSpreadsheet} size="sm" />
          Download a template
        </TButton>
      </div>
    </TCard>
  )
}
