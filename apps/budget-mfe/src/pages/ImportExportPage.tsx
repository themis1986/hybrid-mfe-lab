import { TGrid } from '@repo/ui'
import { ExportCard } from '../components/csv/ExportCard'
import { ImportCard } from '../components/csv/ImportCard'
import { ImportPreview } from '../components/csv/ImportPreview'
import { useCsvImport } from '../hooks/useCsv'

export function ImportExportPage() {
  const csv = useCsvImport()
  return (
    <div className="flex flex-col gap-4">
      <TGrid minChildWidth="22rem" gap={4}>
        <ExportCard />
        <ImportCard files={csv.files} state={csv.state} onChoose={(files) => void csv.choose(files)} />
      </TGrid>
      {csv.state.status === 'preview' && (
        <ImportPreview
          fileName={csv.state.fileName}
          preview={csv.state.preview}
          onImport={csv.importValid}
          onCancel={csv.cancel}
        />
      )}
    </div>
  )
}
