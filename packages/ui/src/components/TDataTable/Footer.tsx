import type { TableRowData } from '@repo/table-core'
import { TPagination } from '../TPagination'
import { TSelect } from '../TSelect'
import { useDataTableContext } from './context'
import type { EngineTable } from './context'
import {
  tDataTableFooterClasses,
  tDataTableFooterSizeClasses,
  tDataTablePagerClasses,
  tDataTablePageSizeClasses,
  tDataTableRangeClasses,
} from './TDataTable.variants'

export function Footer<TData extends TableRowData>({
  table,
  pageSizes,
  disabled,
}: {
  table: EngineTable<TData>
  pageSizes: readonly number[]
  disabled: boolean
}) {
  const { labels } = useDataTableContext()
  const { pageIndex, pageSize } = table.state.pagination
  const total = table.getRowCount()
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)
  const options = pageSizes.map((size) => ({
    value: String(size),
    label: String(size),
  }))
  return (
    <div data-slot="data-table-footer" className={tDataTableFooterClasses}>
      <div className={tDataTableFooterSizeClasses}>
        <span>{labels.rowsPerPage}</span>
        <TSelect
          size="sm"
          aria-label={labels.rowsPerPage}
          options={options}
          value={String(pageSize)}
          disabled={disabled}
          className={tDataTablePageSizeClasses}
          onValueChange={(next) => table.setPageSize(Number(next))}
        />
      </div>
      <span className={tDataTableRangeClasses} aria-live="polite">
        {labels.rowRange(from, to, total)}
      </span>
      <TPagination
        size="sm"
        page={pageIndex + 1}
        total={total}
        itemsPerPage={pageSize}
        disabled={disabled}
        labels={labels.pagination}
        className={tDataTablePagerClasses}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    </div>
  )
}
