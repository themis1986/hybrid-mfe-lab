import {
  formatTableNumber,
  TABLE_DETAIL_COLUMN,
  TABLE_FULL_ROW_COLUMN,
  TABLE_SELECT_COLUMN,
  tableCellVars,
  type TableRowData,
  tableDetailKey,
} from '@repo/table-core'
import { ChevronRight } from 'lucide-react'
import { type CSSProperties, memo, type ReactNode, useRef } from 'react'
import { TButton } from '../TButton'
import { TCheckbox } from '../TCheckbox'
import { TIcon } from '../TIcon'
import { BuiltInCell, CellEditor } from './Cells'
import { useDataTableContext } from './context'
import type { EngineRow } from './context'
import {
  tDataTableAggregateClasses,
  tDataTableCellButtonSmallClasses,
  tDataTableCellClasses,
  tDataTableCellFillerClasses,
  tDataTableChevronClasses,
  tDataTableExpanderClasses,
  tDataTableExpanderSpacerClasses,
  tDataTableFullCellClasses,
  tDataTableFullContentClasses,
  tDataTableGroupCountClasses,
  tDataTableRowClasses,
} from './TDataTable.variants'
import type { TDataTableColumn, TDataTableRowContext } from './types'

type EngineCell<TData extends TableRowData> = ReturnType<
  EngineRow<TData>['getVisibleCells']
>[number]

const virtualStyle = (start?: number): CSSProperties | undefined =>
  start === undefined ? undefined : { transform: `translateY(${start}px)` }

function SelectRow<TData extends TableRowData>({
  row,
  isSelected,
  isSomeSelected,
}: {
  row: EngineRow<TData>
  isSelected: boolean
  isSomeSelected: boolean
}) {
  const { labels } = useDataTableContext()
  // The checkbox's change callback carries no event, and the engine's range selection reads Shift from one.
  const shift = useRef(false)
  return (
    <TCheckbox
      size="sm"
      tabIndex={-1}
      data-t-select=""
      data-t-activate=""
      aria-label={labels.selectRow}
      disabled={!row.getCanSelect()}
      checked={isSelected ? true : isSomeSelected ? 'indeterminate' : false}
      onClick={(event) => {
        shift.current = event.shiftKey
      }}
      onCheckedChange={(next) =>
        row.getToggleSelectedHandler()({
          target: { checked: next === true },
          shiftKey: shift.current,
        })
      }
    />
  )
}

function Expander<TData extends TableRowData>({
  row,
  isExpanded,
}: {
  row: EngineRow<TData>
  isExpanded: boolean
}) {
  const { labels } = useDataTableContext()
  return (
    <TButton
      variant="ghost"
      size="sm"
      tabIndex={-1}
      data-t-activate=""
      aria-label={isExpanded ? labels.collapseRow : labels.expandRow}
      aria-expanded={isExpanded}
      className={tDataTableCellButtonSmallClasses}
      onClick={() => row.toggleExpanded()}
    >
      <TIcon
        icon={ChevronRight}
        data-open={isExpanded ? '' : undefined}
        className={tDataTableChevronClasses}
      />
    </TButton>
  )
}

function rowContext<TData extends TableRowData>(
  row: EngineRow<TData>,
  isSelected: boolean,
  isExpanded: boolean,
  canExpand: boolean,
): TDataTableRowContext<TData> {
  return {
    row: row.original,
    rowId: row.id,
    depth: row.depth,
    isSelected,
    isExpanded,
    canExpand,
    toggleExpanded: () => row.toggleExpanded(),
  }
}

function BodyCell<TData extends TableRowData>({
  cell,
  index,
  row,
  isSelected,
  isSomeSelected,
  isExpanded,
  canExpand,
  isExpanderCell,
  isEditing,
}: {
  cell: EngineCell<TData>
  index: number
  row: EngineRow<TData>
  isSelected: boolean
  isSomeSelected: boolean
  isExpanded: boolean
  canExpand: boolean
  /** Holds the row's chevron and indent: the first data cell of a tree. */
  isExpanderCell: boolean
  isEditing: boolean
}) {
  const { labels, locale, startEdit } = useDataTableContext()
  const { column } = cell
  const meta = column.columnDef.meta
  const spec = meta?.spec as TDataTableColumn<TData> | undefined
  const pinned = column.getIsPinned()
  const edge =
    pinned === 'start' && column.getIsLastColumn('start')
      ? 'start'
      : pinned === 'end' && column.getIsFirstColumn('end')
        ? 'end'
        : undefined

  const editable =
    Boolean(spec) &&
    !row.getIsGrouped() &&
    (typeof spec?.editable === 'function'
      ? spec.editable(row.original)
      : Boolean(spec?.editable))

  let content: ReactNode = null
  if (isEditing && spec) {
    content = (
      <CellEditor
        spec={spec}
        value={cell.getValue()}
        row={row.original}
        rowId={row.id}
        columnId={column.id}
      />
    )
  } else if (column.id === TABLE_SELECT_COLUMN) {
    content = (
      <SelectRow
        row={row}
        isSelected={isSelected}
        isSomeSelected={isSomeSelected}
      />
    )
  } else if (column.id === TABLE_DETAIL_COLUMN) {
    content =
      canExpand && !row.getIsGrouped() ? (
        <Expander row={row} isExpanded={isExpanded} />
      ) : null
  } else if (cell.getIsPlaceholder()) {
    content = null
  } else if (cell.getIsGrouped() && spec) {
    content = (
      <>
        <Expander row={row} isExpanded={isExpanded} />
        <BuiltInCell spec={spec} value={cell.getValue()} row={row.original} />
        <span className={tDataTableGroupCountClasses}>
          {labels.groupCount(row.subRows.length)}
        </span>
      </>
    )
  } else if (row.getIsGrouped() && spec) {
    const value = cell.getValue()
    content = spec.aggregate ? (
      <span className={tDataTableAggregateClasses}>
        {typeof value === 'number'
          ? formatTableNumber(value, locale, spec.number)
          : String(value ?? '')}
      </span>
    ) : null
  } else if (spec) {
    const value = cell.getValue()
    content = spec.cell ? (
      spec.cell({
        ...rowContext(row, isSelected, isExpanded, canExpand),
        value,
        columnId: column.id,
        startEdit: () => startEdit(row.id, column.id),
        tabIndex: -1,
      })
    ) : (
      <BuiltInCell spec={spec} value={value} row={row.original} />
    )
    if (isExpanderCell) {
      content = (
        <span
          className={tDataTableExpanderClasses}
          style={
            { '--t-cell-indent': `${row.depth * 1.25}rem` } as CSSProperties
          }
        >
          {canExpand ? (
            <Expander row={row} isExpanded={isExpanded} />
          ) : (
            <span className={tDataTableExpanderSpacerClasses} />
          )}
          {content}
        </span>
      )
    }
  }

  return (
    <td
      role="gridcell"
      tabIndex={-1}
      data-col={column.id}
      data-pin={pinned || undefined}
      data-pin-edge={edge}
      data-editable={editable ? '' : undefined}
      data-editing={isEditing ? '' : undefined}
      data-align={spec?.align ?? (spec?.type === 'number' ? 'end' : undefined)}
      aria-colindex={index + 1}
      className={tDataTableCellClasses}
      onDoubleClick={
        editable && !isEditing ? () => startEdit(row.id, column.id) : undefined
      }
      style={tableCellVars(meta?.index ?? 0, pinned)}
    >
      {content}
    </td>
  )
}

interface TableRowProps<TData extends TableRowData> {
  row: EngineRow<TData>
  ariaRowIndex: number
  isSelected: boolean
  isSomeSelected: boolean
  isExpanded: boolean
  canExpand: boolean
  selectable: boolean
  zebra: boolean
  hover: boolean
  /** A tree or groups: the row has a level, and says whether it is open. */
  hierarchical: boolean
  /** A tree's rows have their chevron in this column. */
  expanderColumnId?: string
  positionInSet?: number
  setSize?: number
  /** The column being edited in this row. */
  editColumnId?: string
  /** The visible columns and pins: a change re-renders the row, as `row` stays the same object. */
  columnsKey: string
  /** A virtual row's offset. A number rather than a style, so a row that stays in place doesn't re-render. */
  virtualStart?: number
  /** Which virtual item this is: the virtualizer finds it by this when measuring. */
  virtualIndex?: number
  measureRef?: (element: HTMLElement | null) => void
}

function TableRowInner<TData extends TableRowData>({
  row,
  ariaRowIndex,
  isSelected,
  isSomeSelected,
  isExpanded,
  canExpand,
  selectable,
  zebra,
  hover,
  hierarchical,
  expanderColumnId,
  positionInSet,
  setSize,
  editColumnId,
  virtualStart,
  virtualIndex,
  measureRef,
}: TableRowProps<TData>) {
  const cells = row.getVisibleCells()
  const firstEnd = cells.findIndex(
    (cell) => cell.column.getIsPinned() === 'end',
  )
  const fillerAt = firstEnd < 0 ? cells.length : firstEnd
  const filler = (
    <td
      key="filler"
      role="presentation"
      className={tDataTableCellFillerClasses}
    />
  )
  return (
    <tr
      ref={measureRef}
      role="row"
      data-row-key={row.id}
      data-index={virtualIndex}
      data-virtual={virtualStart === undefined ? undefined : ''}
      data-zebra={zebra && !isSelected ? 'odd' : undefined}
      data-selected={isSelected ? '' : undefined}
      data-hover={hover ? '' : undefined}
      aria-rowindex={ariaRowIndex}
      aria-selected={selectable ? isSelected : undefined}
      aria-level={hierarchical ? row.depth + 1 : undefined}
      aria-setsize={hierarchical ? setSize : undefined}
      aria-posinset={hierarchical ? positionInSet : undefined}
      aria-expanded={hierarchical && canExpand ? isExpanded : undefined}
      className={tDataTableRowClasses}
      style={virtualStyle(virtualStart)}
    >
      {cells.map((cell, index) => [
        index === fillerAt ? filler : null,
        <BodyCell
          key={cell.id}
          cell={cell}
          index={index}
          row={row}
          isSelected={isSelected}
          isSomeSelected={isSomeSelected}
          isExpanded={isExpanded}
          canExpand={canExpand}
          isExpanderCell={cell.column.id === expanderColumnId}
          isEditing={cell.column.id === editColumnId}
        />,
      ])}
      {fillerAt === cells.length ? filler : null}
    </tr>
  )
}

export const TableRow = memo(TableRowInner) as typeof TableRowInner

/** The panel under an open row: a row of its own, so it has its own height. */
function DetailRowInner<TData extends TableRowData>({
  row,
  ariaRowIndex,
  isSelected,
  zebra,
  virtualStart,
  virtualIndex,
  measureRef,
}: {
  row: EngineRow<TData>
  ariaRowIndex: number
  isSelected: boolean
  zebra: boolean
  virtualStart?: number
  virtualIndex?: number
  measureRef?: (element: HTMLElement | null) => void
}) {
  const { latest } = useDataTableContext()
  return (
    <tr
      ref={measureRef}
      role="row"
      data-row-key={tableDetailKey(row.id)}
      data-index={virtualIndex}
      data-virtual={virtualStart === undefined ? undefined : ''}
      data-zebra={zebra && !isSelected ? 'odd' : undefined}
      aria-rowindex={ariaRowIndex}
      className={tDataTableRowClasses}
      style={virtualStyle(virtualStart)}
    >
      <td
        role="gridcell"
        tabIndex={-1}
        data-col={TABLE_FULL_ROW_COLUMN}
        className={tDataTableFullCellClasses}
      >
        <div className={tDataTableFullContentClasses}>
          {latest.current.renderDetail?.(
            rowContext(row, isSelected, true, true),
          )}
        </div>
      </td>
    </tr>
  )
}

export const DetailRow = memo(DetailRowInner) as typeof DetailRowInner
