import {
  TABLE_FULL_ROW_COLUMN,
  tableCellVars,
  type TableDisplayItem,
  type TableRowData,
  withRetainedTableRows,
} from '@repo/table-core'
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual'
import { type ReactNode, type RefObject, useLayoutEffect, useMemo } from 'react'
import { TButton } from '../TButton'
import { TSkeleton } from '../TSkeleton'
import { useDataTableContext } from './context'
import type { EngineRow, EngineTable } from './context'
import { DetailRow, TableRow } from './Row'
import {
  tDataTableBodyClasses,
  tDataTableCellClasses,
  tDataTableCellFillerClasses,
  tDataTableFullCellClasses,
  tDataTableRowClasses,
  tDataTableStateClasses,
} from './TDataTable.variants'

const SKELETON_ROWS = 8

function FullRow({
  rowKey,
  children,
}: {
  rowKey: string
  children: ReactNode
}) {
  return (
    <tr
      role="row"
      data-row-key={rowKey}
      className={tDataTableRowClasses}
      aria-rowindex={2}
    >
      <td
        role="gridcell"
        tabIndex={-1}
        data-col={TABLE_FULL_ROW_COLUMN}
        className={tDataTableFullCellClasses}
      >
        <div className={tDataTableStateClasses}>{children}</div>
      </td>
    </tr>
  )
}

function SkeletonRows<TData extends TableRowData>({
  table,
}: {
  table: EngineTable<TData>
}) {
  const columns = table.getVisibleLeafColumns()
  const count = Math.min(table.state.pagination.pageSize, SKELETON_ROWS)
  return Array.from({ length: count }, (_, rowIndex) => (
    <tr key={rowIndex} role="row" aria-hidden className={tDataTableRowClasses}>
      {columns.map((column) => (
        <td
          key={column.id}
          role="presentation"
          className={tDataTableCellClasses}
          data-pin={column.getIsPinned() || undefined}
          style={tableCellVars(
            column.columnDef.meta?.index ?? 0,
            column.getIsPinned(),
          )}
        >
          <TSkeleton />
        </td>
      ))}
      <td role="presentation" className={tDataTableCellFillerClasses} />
    </tr>
  ))
}

interface RowsProps<TData extends TableRowData> {
  items: TableDisplayItem<EngineRow<TData>>[]
  columnsKey: string
  zebra: boolean
  hover: boolean
  pageOffset: number
  selectable: boolean
  hierarchical: boolean
  expanderColumnId?: string
  editing: { rowId: string; columnId: string } | null
}

function renderItem<TData extends TableRowData>(
  item: TableDisplayItem<EngineRow<TData>>,
  props: RowsProps<TData>,
  virtual?: {
    start: number
    measure: (element: HTMLElement | null) => void
  },
) {
  const { row } = item
  const ariaRowIndex = props.pageOffset + item.index + 2
  if (item.kind === 'detail') {
    return (
      <DetailRow
        key={item.key}
        row={row}
        ariaRowIndex={ariaRowIndex}
        isSelected={row.getIsSelected()}
        zebra={props.zebra && item.index % 2 === 1}
        virtualStart={virtual?.start}
        virtualIndex={virtual ? item.index : undefined}
        measureRef={virtual?.measure}
      />
    )
  }
  return (
    <TableRow
      key={item.key}
      row={row}
      ariaRowIndex={ariaRowIndex}
      isSelected={row.getIsSelected()}
      isSomeSelected={row.getIsSomeSelected()}
      isExpanded={row.getIsExpanded()}
      canExpand={row.getCanExpand()}
      selectable={props.selectable}
      zebra={props.zebra && item.index % 2 === 1}
      hover={props.hover}
      hierarchical={props.hierarchical}
      expanderColumnId={props.expanderColumnId}
      positionInSet={item.positionInSet}
      setSize={item.setSize}
      editColumnId={
        props.editing?.rowId === row.id ? props.editing.columnId : undefined
      }
      columnsKey={props.columnsKey}
      virtualStart={virtual?.start}
      virtualIndex={virtual ? item.index : undefined}
      measureRef={virtual?.measure}
    />
  )
}

// A component of its own: scrolling re-renders this and nothing above it.
function VirtualRows<TData extends TableRowData>({
  scrollerRef,
  headerHeight,
  estimateRowHeight,
  overscan,
  activeRowKey,
  scrollToItemRef,
  onRendered,
  refetching,
  ...props
}: RowsProps<TData> & {
  scrollerRef: RefObject<HTMLElement | null>
  headerHeight: number
  estimateRowHeight: number
  overscan: number
  activeRowKey: () => string | null
  scrollToItemRef: { current: (index: number) => void }
  onRendered: () => void
  refetching: boolean
}) {
  const { items, editing } = props
  const indexByKey = useMemo(
    () => new Map(items.map((item) => [item.key, item.index])),
    [items],
  )
  const virtualizer = useVirtualizer<HTMLElement, HTMLElement>({
    count: items.length,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
    getItemKey: (index) => items[index]?.key ?? index,
    // The rows start after the header, which sits in the same scroller.
    scrollMargin: headerHeight,
    // Scroll updates batch with React's, as flushSync warns inside its lifecycle on React 19.
    useFlushSync: false,
    rangeExtractor: (range) => {
      const active = activeRowKey()
      return withRetainedTableRows(defaultRangeExtractor(range), [
        active === null ? undefined : indexByKey.get(active),
        editing ? indexByKey.get(editing.rowId) : undefined,
      ])
    },
  })
  useLayoutEffect(() => {
    scrollToItemRef.current = (index) =>
      virtualizer.scrollToIndex(index, { align: 'auto' })
  }, [scrollToItemRef, virtualizer])
  useLayoutEffect(onRendered)

  return (
    <tbody
      role="rowgroup"
      data-refetching={refetching ? '' : undefined}
      className={tDataTableBodyClasses}
      style={{ height: virtualizer.getTotalSize() - headerHeight }}
    >
      {virtualizer.getVirtualItems().map((virtualItem) => {
        const item = items[virtualItem.index]
        if (!item) return null
        return renderItem(item, props, {
          start: virtualItem.start - headerHeight,
          measure: virtualizer.measureElement,
        })
      })}
    </tbody>
  )
}

export function Body<TData extends TableRowData>({
  table,
  items,
  columnsKey,
  zebra,
  hover,
  loading,
  refetching,
  error,
  onRetry,
  renderEmpty,
  renderError,
  pageOffset,
  selectable,
  hierarchical,
  expanderColumnId,
  editing,
  virtual,
  onRendered,
}: {
  table: EngineTable<TData>
  items: TableDisplayItem<EngineRow<TData>>[]
  columnsKey: string
  zebra: boolean
  hover: boolean
  loading: boolean
  refetching: boolean
  error: unknown
  onRetry?: () => void
  renderEmpty?: () => ReactNode
  renderError?: (context: { error: unknown; retry?: () => void }) => ReactNode
  pageOffset: number
  selectable: boolean
  hierarchical: boolean
  expanderColumnId?: string
  editing: { rowId: string; columnId: string } | null
  virtual?: {
    scrollerRef: RefObject<HTMLElement | null>
    headerHeight: number
    estimateRowHeight: number
    overscan: number
    activeRowKey: () => string | null
    scrollToItemRef: { current: (index: number) => void }
  }
  onRendered: () => void
}) {
  const { labels } = useDataTableContext()
  useLayoutEffect(onRendered)
  const rowsProps: RowsProps<TData> = {
    items,
    columnsKey,
    zebra,
    hover,
    pageOffset,
    selectable,
    hierarchical,
    expanderColumnId,
    editing,
  }

  const hasError = error !== undefined && error !== null && error !== false
  const filtered =
    table.state.columnFilters.length > 0 || Boolean(table.state.globalFilter)

  let content: ReactNode
  if (loading) {
    content = <SkeletonRows table={table} />
  } else if (hasError) {
    content = (
      <FullRow rowKey="__error">
        {renderError ? (
          renderError({ error, retry: onRetry })
        ) : (
          <>
            <span>{labels.error}</span>
            {onRetry ? (
              <TButton variant="outline" size="sm" onClick={onRetry}>
                {labels.retry}
              </TButton>
            ) : null}
          </>
        )}
      </FullRow>
    )
  } else if (!items.length) {
    content = (
      <FullRow rowKey="__empty">
        {renderEmpty
          ? renderEmpty()
          : filtered
            ? labels.emptyFiltered
            : labels.empty}
      </FullRow>
    )
  } else if (virtual) {
    return (
      <VirtualRows
        {...rowsProps}
        {...virtual}
        refetching={refetching}
        onRendered={onRendered}
      />
    )
  } else {
    content = items.map((item) => renderItem(item, rowsProps))
  }

  return (
    <tbody
      role="rowgroup"
      data-refetching={refetching ? '' : undefined}
      className={tDataTableBodyClasses}
    >
      {content}
    </tbody>
  )
}
