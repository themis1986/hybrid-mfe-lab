import { memo, useId } from 'react'
import { useSortableColumn } from '../../dnd/useSortableColumn'
import { useColumn } from '../../hooks/useBoard'
import type { CardId, ColumnId } from '../../types'
import { BoardCard } from '../card/BoardCard'
import { ColumnHeader } from './ColumnHeader'
import { QuickAddCard } from './QuickAddCard'

export const COLUMN_SHELL_CLASSES =
  'box-border flex max-h-(--kanban-board-height) w-72 shrink-0 flex-col gap-2 rounded-lg border border-line bg-surface font-sans'

export const BoardColumn = memo(function BoardColumn({
  id,
  index,
  cardIds,
  hiddenCount,
}: {
  id: ColumnId
  index: number
  /** The cards to show: what the filters leave, in the order a drag has them in. */
  cardIds: readonly CardId[]
  /** How many of the column's cards the filters hide. */
  hiddenCount: number
}) {
  const column = useColumn(id)
  const headingId = useId()
  const { ref, handleRef, isDragSource, isDropTarget } = useSortableColumn(
    id,
    index,
    cardIds.length === 0,
  )
  if (!column) return null

  const overLimit =
    column.wipLimit !== null && column.cardIds.length > column.wipLimit

  return (
    <section
      ref={ref}
      aria-labelledby={headingId}
      data-column={id}
      data-dragging={isDragSource || undefined}
      data-over-limit={overLimit || undefined}
      className={`snap-start transition-colors duration-150 motion-reduce:transition-none data-dragging:border-dashed data-dragging:border-accent data-dragging:bg-accent-subtle data-over-limit:border-warning-line ${COLUMN_SHELL_CLASSES}`}
    >
      <div className="contents in-data-dragging:invisible">
        <ColumnHeader
          column={column}
          headingId={headingId}
          handleRef={handleRef}
        />
        <ul
          aria-labelledby={headingId}
          className="m-0 flex min-h-16 flex-1 list-none flex-col gap-2 overflow-y-auto overscroll-contain px-2 py-1 [scrollbar-width:thin]"
        >
          {cardIds.map((cardId, cardIndex) => (
            <BoardCard
              key={cardId}
              id={cardId}
              index={cardIndex}
              columnId={id}
            />
          ))}
          {cardIds.length === 0 && (
            <li
              data-drop-target={isDropTarget || undefined}
              className="box-border flex min-h-16 list-none items-center justify-center rounded-md border border-dashed border-line p-3 text-center text-xs text-fg-muted transition-colors duration-150 motion-reduce:transition-none data-drop-target:border-accent data-drop-target:bg-accent-subtle data-drop-target:text-accent-fg"
            >
              {hiddenCount > 0
                ? `${hiddenCount} hidden by filters`
                : 'No cards yet. Drop one here.'}
            </li>
          )}
          {cardIds.length > 0 && hiddenCount > 0 && (
            <li className="list-none px-1 text-center text-xs text-fg-muted">
              {hiddenCount} more hidden by filters
            </li>
          )}
        </ul>
        <div className="flex flex-col px-2 pb-2">
          <QuickAddCard columnId={id} />
        </div>
      </div>
    </section>
  )
})
