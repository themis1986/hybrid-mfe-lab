import { describeTableFilter, type TableRowData } from '@repo/table-core'
import { Download, X } from 'lucide-react'
import { type ReactNode, useEffect, useState } from 'react'
import { TButton } from '../TButton'
import {
  tComboboxChipClasses,
  tComboboxChipIconClasses,
  tComboboxChipLabelClasses,
  tComboboxChipRemoveClasses,
} from '../TCombobox/TCombobox.variants'
import { TIcon } from '../TIcon'
import { TInput } from '../TInput'
import { useDataTableContext } from './context'
import type { EngineTable } from './context'
import {
  tDataTableBulkClasses,
  tDataTableBulkCountClasses,
  tDataTableChipsClasses,
  tDataTableSearchClasses,
  tDataTableToolbarClasses,
  tDataTableToolbarEndClasses,
} from './TDataTable.variants'

const SEARCH_DELAY = 200

function SearchBox<TData extends TableRowData>({
  table,
}: {
  table: EngineTable<TData>
}) {
  const { labels } = useDataTableContext()
  const applied = table.state.globalFilter ?? ''
  const [text, setText] = useState<string>(applied)
  useEffect(() => setText(applied), [applied])
  useEffect(() => {
    if (text === applied) return
    const timer = setTimeout(() => table.setGlobalFilter(text), SEARCH_DELAY)
    return () => clearTimeout(timer)
  }, [table, text, applied])
  return (
    <TInput
      type="search"
      size="sm"
      aria-label={labels.search}
      placeholder={labels.searchPlaceholder}
      value={text}
      className={tDataTableSearchClasses}
      onChange={(event) => setText(event.target.value)}
    />
  )
}

export function Toolbar<TData extends TableRowData>({
  table,
  search,
  canExport,
  onExport,
  extra,
  end,
}: {
  table: EngineTable<TData>
  search: boolean
  canExport: boolean
  onExport: () => void
  extra?: ReactNode
  end?: ReactNode
}) {
  const { labels } = useDataTableContext()
  if (!search && !canExport && !extra && !end) return null
  return (
    <div data-slot="data-table-toolbar" className={tDataTableToolbarClasses}>
      {search ? <SearchBox table={table} /> : null}
      {extra}
      <div className={tDataTableToolbarEndClasses}>
        {end}
        {canExport ? (
          <TButton variant="outline" size="sm" onClick={onExport}>
            <TIcon icon={Download} size="sm" />
            {labels.exportCsv}
          </TButton>
        ) : null}
      </div>
    </div>
  )
}

export function FilterChips<TData extends TableRowData>({
  table,
}: {
  table: EngineTable<TData>
}) {
  const { labels, locale } = useDataTableContext()
  const filters = table.state.columnFilters
  const globalFilter = table.state.globalFilter as string | undefined
  if (!filters.length && !globalFilter) return null
  return (
    <div
      data-slot="data-table-chips"
      role="group"
      aria-label={labels.activeFilters}
      className={tDataTableChipsClasses}
    >
      {globalFilter ? (
        <span className={tComboboxChipClasses}>
          <span className={tComboboxChipLabelClasses}>{globalFilter}</span>
          <button
            type="button"
            aria-label={labels.removeFilter(globalFilter)}
            className={tComboboxChipRemoveClasses}
            onClick={() => table.setGlobalFilter('')}
          >
            <TIcon icon={X} className={tComboboxChipIconClasses} />
          </button>
        </span>
      ) : null}
      {filters.map(({ id, value }) => {
        const column = table.getColumn(id)
        const spec = column?.columnDef.meta?.spec
        if (!column || !spec) return null
        const filter = spec.filter
        const description = describeTableFilter(spec, value, {
          labels,
          locale,
          filterOptions:
            filter?.type === 'select' || filter?.type === 'multiSelect'
              ? filter.options
              : undefined,
        })
        return (
          <span key={id} className={tComboboxChipClasses}>
            <span className={tComboboxChipLabelClasses}>{description}</span>
            <button
              type="button"
              aria-label={labels.removeFilter(description)}
              className={tComboboxChipRemoveClasses}
              onClick={() => column.setFilterValue(undefined)}
            >
              <TIcon icon={X} className={tComboboxChipIconClasses} />
            </button>
          </span>
        )
      })}
      <TButton
        variant="ghost"
        size="sm"
        onClick={() => {
          table.setColumnFilters([])
          table.setGlobalFilter('')
        }}
      >
        {labels.clearAllFilters}
      </TButton>
    </div>
  )
}

export function BulkBar({
  count,
  children,
  onClear,
}: {
  count: number
  children?: ReactNode
  onClear: () => void
}) {
  const { labels } = useDataTableContext()
  return (
    <div data-slot="data-table-bulk" className={tDataTableBulkClasses}>
      <span className={tDataTableBulkCountClasses} aria-live="polite">
        {labels.selectedCount(count)}
      </span>
      {children}
      <TButton variant="ghost" size="sm" onClick={onClear}>
        {labels.clearSelection}
      </TButton>
    </div>
  )
}
