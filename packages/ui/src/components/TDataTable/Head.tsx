import {
  isSyntheticTableColumn,
  TABLE_HEADER_ROW,
  TABLE_SELECT_COLUMN,
  tableCellVars,
  type TableRowData,
} from '@repo/table-core'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EllipsisVertical,
  ListFilter,
} from 'lucide-react'
import type { RefObject } from 'react'
import { TButton } from '../TButton'
import { TCheckbox } from '../TCheckbox'
import {
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuSeparator,
  TDropdownMenuTrigger,
} from '../TDropdownMenu'
import { TIcon } from '../TIcon'
import { useDataTableContext } from './context'
import type { EngineTable } from './context'
import { ColumnFilter } from './Filters'
import {
  tDataTableFilterMarkClasses,
  tDataTableHeadActionsClasses,
  tDataTableHeadButtonClasses,
  tDataTableHeadCellClasses,
  tDataTableHeadClasses,
  tDataTableHeadFillerClasses,
  tDataTableHeadLabelClasses,
  tDataTableHeadRowClasses,
  tDataTableResizeClasses,
  tDataTableSortClasses,
  tDataTableSortIconClasses,
  tDataTableSortOrderClasses,
} from './TDataTable.variants'
import type { TDataTableColumn } from './types'

type EngineHeader<TData extends TableRowData> = ReturnType<
  EngineTable<TData>['getHeaderGroups']
>[number]['headers'][number]

function SelectAll<TData extends TableRowData>({
  table,
  scope,
}: {
  table: EngineTable<TData>
  scope: 'page' | 'all'
}) {
  const { labels } = useDataTableContext()
  const all =
    scope === 'all'
      ? table.getIsAllRowsSelected()
      : table.getIsAllPageRowsSelected()
  const some =
    scope === 'all'
      ? table.getIsSomeRowsSelected()
      : table.getIsSomePageRowsSelected()
  return (
    <TCheckbox
      size="sm"
      tabIndex={-1}
      data-t-activate=""
      aria-label={labels.selectAll}
      checked={all ? true : some ? 'indeterminate' : false}
      onCheckedChange={(next) => {
        if (scope === 'all') table.toggleAllRowsSelected(next === true)
        else table.toggleAllPageRowsSelected(next === true)
      }}
    />
  )
}

function ColumnMenu<TData extends TableRowData>({
  column,
  title,
}: {
  column: EngineHeader<TData>['column']
  title: string
}) {
  const { labels } = useDataTableContext()
  const canSort = column.getCanSort()
  const canPin = column.getCanPin()
  const canHide = column.getCanHide()
  const canGroup = column.getCanGroup()
  if (!canSort && !canPin && !canHide && !canGroup) return null
  const sorted = column.getIsSorted()
  const pinned = column.getIsPinned()
  return (
    <TDropdownMenu>
      <TDropdownMenuTrigger asChild>
        <TButton
          variant="ghost"
          size="sm"
          tabIndex={-1}
          data-no-reorder
          aria-label={labels.columnMenu(title)}
          className={tDataTableHeadButtonClasses}
        >
          <TIcon icon={EllipsisVertical} size="sm" />
        </TButton>
      </TDropdownMenuTrigger>
      <TDropdownMenuContent align="end">
        {canSort ? (
          <>
            <TDropdownMenuItem onSelect={() => column.toggleSorting(false)}>
              {labels.sortAscending}
            </TDropdownMenuItem>
            <TDropdownMenuItem onSelect={() => column.toggleSorting(true)}>
              {labels.sortDescending}
            </TDropdownMenuItem>
            {sorted ? (
              <TDropdownMenuItem onSelect={() => column.clearSorting()}>
                {labels.clearSort}
              </TDropdownMenuItem>
            ) : null}
            <TDropdownMenuSeparator />
          </>
        ) : null}
        {canPin ? (
          <>
            {pinned !== 'start' ? (
              <TDropdownMenuItem onSelect={() => column.pin('start')}>
                {labels.pinStart}
              </TDropdownMenuItem>
            ) : null}
            {pinned !== 'end' ? (
              <TDropdownMenuItem onSelect={() => column.pin('end')}>
                {labels.pinEnd}
              </TDropdownMenuItem>
            ) : null}
            {pinned ? (
              <TDropdownMenuItem onSelect={() => column.pin(false)}>
                {labels.unpin}
              </TDropdownMenuItem>
            ) : null}
          </>
        ) : null}
        {canGroup ? (
          <TDropdownMenuItem onSelect={() => column.toggleGrouping()}>
            {column.getIsGrouped() ? labels.ungroup : labels.groupBy}
          </TDropdownMenuItem>
        ) : null}
        {canHide ? (
          <TDropdownMenuItem onSelect={() => column.toggleVisibility(false)}>
            {labels.hideColumn}
          </TDropdownMenuItem>
        ) : null}
      </TDropdownMenuContent>
    </TDropdownMenu>
  )
}

function HeadCell<TData extends TableRowData>({
  table,
  header,
  index,
  scope,
}: {
  table: EngineTable<TData>
  header: EngineHeader<TData>
  index: number
  scope: 'page' | 'all'
}) {
  const { labels } = useDataTableContext()
  const { column } = header
  const meta = column.columnDef.meta
  const spec = meta?.spec as TDataTableColumn<TData> | undefined
  const pinned = column.getIsPinned()
  const sorted = column.getIsSorted()
  const sortIndex = column.getSortIndex()
  const multiSort = table.state.sorting.length > 1
  const title = spec?.title ?? ''
  const headerContext = { columnId: column.id, title }
  const content =
    typeof spec?.header === 'function'
      ? spec.header(headerContext)
      : (spec?.header ?? title)

  const edge =
    pinned === 'start' && column.getIsLastColumn('start')
      ? 'start'
      : pinned === 'end' && column.getIsFirstColumn('end')
        ? 'end'
        : undefined

  return (
    <th
      role="columnheader"
      scope="col"
      tabIndex={-1}
      data-col={column.id}
      data-pin={pinned || undefined}
      data-pin-edge={edge}
      data-pin-region={pinned || 'center'}
      data-align={spec?.align}
      data-reorderable={spec && spec.reorderable !== false ? '' : undefined}
      aria-colindex={index + 1}
      // ARIA asks for one sorted header at a time: the primary one. The others show their order.
      aria-sort={
        sorted && sortIndex === 0
          ? sorted === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
      }
      className={tDataTableHeadCellClasses}
      style={tableCellVars(meta?.index ?? 0, pinned)}
    >
      {column.id === TABLE_SELECT_COLUMN ? (
        table.options.enableMultiRowSelection ? (
          <SelectAll table={table} scope={scope} />
        ) : null
      ) : isSyntheticTableColumn(column.id) ? null : column.getCanSort() ? (
        <button
          type="button"
          tabIndex={-1}
          data-t-activate=""
          className={tDataTableSortClasses}
          onClick={column.getToggleSortingHandler()}
        >
          <span className={tDataTableHeadLabelClasses}>{content}</span>
          <TIcon
            icon={
              sorted === 'asc'
                ? ArrowUp
                : sorted === 'desc'
                  ? ArrowDown
                  : ChevronsUpDown
            }
            className={tDataTableSortIconClasses}
          />
          {sorted && multiSort ? (
            <span
              className={tDataTableSortOrderClasses}
              aria-label={labels.sortOrder(sortIndex + 1)}
            >
              {sortIndex + 1}
            </span>
          ) : null}
          {column.getIsFiltered() ? (
            <TIcon icon={ListFilter} className={tDataTableFilterMarkClasses} />
          ) : null}
        </button>
      ) : (
        <span className={tDataTableHeadLabelClasses}>{content}</span>
      )}
      {spec ? (
        <span className={tDataTableHeadActionsClasses}>
          {spec.filter && column.getCanFilter() ? (
            <ColumnFilter column={column} filter={spec.filter} title={title} />
          ) : null}
          <ColumnMenu column={column} title={title} />
        </span>
      ) : null}
      {column.getCanResize() ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={labels.resizeColumn(title)}
          tabIndex={-1}
          data-t-resize=""
          data-no-reorder
          className={tDataTableResizeClasses}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onDoubleClick={() => column.resetSize()}
        />
      ) : null}
    </th>
  )
}

export function Head<TData extends TableRowData>({
  table,
  headRef,
  sticky,
  scope,
}: {
  table: EngineTable<TData>
  headRef: RefObject<HTMLTableSectionElement | null>
  sticky: boolean
  scope: 'page' | 'all'
}) {
  const headers = table.getHeaderGroups()[0]?.headers ?? []
  const firstEnd = headers.findIndex(
    (header) => header.column.getIsPinned() === 'end',
  )
  const fillerAt = firstEnd < 0 ? headers.length : firstEnd
  return (
    <thead
      ref={headRef}
      role="rowgroup"
      data-sticky={sticky ? '' : undefined}
      className={tDataTableHeadClasses}
    >
      <tr
        role="row"
        aria-rowindex={1}
        data-row-key={TABLE_HEADER_ROW}
        className={tDataTableHeadRowClasses}
      >
        {headers.map((header, index) => [
          index === fillerAt ? (
            <th
              key="filler"
              role="presentation"
              className={tDataTableHeadFillerClasses}
            />
          ) : null,
          <HeadCell
            key={header.id}
            table={table}
            header={header}
            index={index}
            scope={scope}
          />,
        ])}
        {fillerAt === headers.length ? (
          <th
            key="filler"
            role="presentation"
            className={tDataTableHeadFillerClasses}
          />
        ) : null}
      </tr>
    </thead>
  )
}
