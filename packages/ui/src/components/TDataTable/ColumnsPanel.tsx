import { moveTableColumn, type TableRowData } from '@repo/table-core'
import { ChevronLeft, ChevronRight, Columns3 } from 'lucide-react'
import { TButton } from '../TButton'
import { TCheckbox } from '../TCheckbox'
import { TIcon } from '../TIcon'
import {
  TPopover,
  TPopoverContent,
  TPopoverFooter,
  TPopoverTrigger,
} from '../TPopover'
import { useDataTableContext } from './context'
import type { EngineTable } from './context'
import {
  tDataTableColumnsItemClasses,
  tDataTableColumnsLabelClasses,
  tDataTableColumnsListClasses,
  tDataTableColumnsTitleClasses,
  tDataTableMoveClasses,
} from './TDataTable.variants'

/** Show, hide and move columns: also the way to reorder them from the keyboard or on touch. */
export function ColumnsPanel<TData extends TableRowData>({
  table,
}: {
  table: EngineTable<TData>
}) {
  const { labels } = useDataTableContext()
  const all = table.getAllLeafColumns()
  const columns = all.filter((column) => column.columnDef.meta?.spec)

  // The neighbour in the column's own pin region: moving across one has no effect on screen.
  const neighbourOf = (index: number, direction: 1 | -1) => {
    const region = columns[index]?.getIsPinned()
    let next = index + direction
    while (columns[next] && columns[next]!.getIsPinned() !== region) {
      next += direction
    }
    return columns[next]
  }
  const move = (index: number, direction: 1 | -1) => {
    const column = columns[index]
    const neighbour = neighbourOf(index, direction)
    if (!column || !neighbour) return
    table.setColumnOrder(
      moveTableColumn(
        all.map((item) => item.id),
        column.id,
        neighbour.id,
        direction === 1 ? 'after' : 'before',
      ),
    )
  }

  return (
    <TPopover>
      <TPopoverTrigger asChild>
        <TButton variant="outline" size="sm">
          <TIcon icon={Columns3} size="sm" />
          {labels.columns}
        </TButton>
      </TPopoverTrigger>
      <TPopoverContent
        size="sm"
        align="end"
        title={labels.columns}
        closeLabel={labels.closePanel}
      >
        <ul className={tDataTableColumnsListClasses}>
          {columns.map((column, index) => {
            const title = column.columnDef.meta?.spec?.title ?? column.id
            return (
              <li key={column.id} className={tDataTableColumnsItemClasses}>
                <label className={tDataTableColumnsLabelClasses}>
                  <TCheckbox
                    size="sm"
                    checked={column.getIsVisible()}
                    disabled={!column.getCanHide()}
                    onCheckedChange={(next) =>
                      column.toggleVisibility(next === true)
                    }
                  />
                  <span className={tDataTableColumnsTitleClasses}>{title}</span>
                </label>
                <TButton
                  variant="ghost"
                  size="sm"
                  disabled={!neighbourOf(index, -1)}
                  aria-label={labels.moveColumnEarlier(title)}
                  className={tDataTableMoveClasses}
                  onClick={() => move(index, -1)}
                >
                  <TIcon icon={ChevronLeft} size="sm" />
                </TButton>
                <TButton
                  variant="ghost"
                  size="sm"
                  disabled={!neighbourOf(index, 1)}
                  aria-label={labels.moveColumnLater(title)}
                  className={tDataTableMoveClasses}
                  onClick={() => move(index, 1)}
                >
                  <TIcon icon={ChevronRight} size="sm" />
                </TButton>
              </li>
            )
          })}
        </ul>
        <TPopoverFooter>
          <TButton
            variant="ghost"
            size="sm"
            onClick={() => table.toggleAllColumnsVisible(true)}
          >
            {labels.showAllColumns}
          </TButton>
        </TPopoverFooter>
      </TPopoverContent>
    </TPopover>
  )
}
