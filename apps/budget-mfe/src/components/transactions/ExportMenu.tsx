import {
  TButton,
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuTrigger,
  TIcon,
} from '@repo/ui'
import { ChevronDown, Download } from '@repo/ui/icons'
import { useCsvExport } from '../../hooks/useCsv'

/** CSV downloads from the table: exactly the rows it shows, or everything. */
export function ExportMenu() {
  const csv = useCsvExport()
  return (
    <TDropdownMenu>
      <TDropdownMenuTrigger asChild>
        <TButton variant="outline" size="sm" className="ms-auto">
          <TIcon icon={Download} size="sm" />
          Export
          <TIcon icon={ChevronDown} size="sm" />
        </TButton>
      </TDropdownMenuTrigger>
      <TDropdownMenuContent align="end">
        <TDropdownMenuItem disabled={csv.viewCount === 0} onSelect={csv.exportView}>
          This view ({csv.viewCount})
        </TDropdownMenuItem>
        <TDropdownMenuItem disabled={csv.allCount === 0} onSelect={csv.exportAll}>
          Everything ({csv.allCount})
        </TDropdownMenuItem>
      </TDropdownMenuContent>
    </TDropdownMenu>
  )
}
