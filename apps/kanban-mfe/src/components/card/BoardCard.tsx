import { memo } from 'react'
import { useBoardDnd } from '../../dnd/BoardDnd'
import { useSortableCard } from '../../dnd/useSortableCard'
import {
  useCard,
  useIsLastColumn,
  useLabels,
  useMembers,
} from '../../hooks/useBoard'
import { useDialogs } from '../../hooks/useDialogs'
import { today } from '../../lib/dates'
import { describeCard } from '../../lib/describe'
import type { CardId, ColumnId } from '../../types'
import { CardFace } from './CardFace'
import { CardMenu } from './CardMenu'

export const CARD_SHELL_CLASSES =
  'box-border rounded-md border border-line bg-canvas p-3 font-sans shadow-sm'

export const BoardCard = memo(function BoardCard({
  id,
  index,
  columnId,
}: {
  id: CardId
  index: number
  columnId: ColumnId
}) {
  const card = useCard(id)
  const labels = useLabels()
  const members = useMembers()
  const isDone = useIsLastColumn(columnId)
  const { openDialog } = useDialogs()
  const { isDragActive } = useBoardDnd()
  const { ref, handleRef, isDragSource } = useSortableCard(id, index, columnId)
  if (!card) return null
  const now = today()

  return (
    <li
      ref={ref}
      data-card={id}
      data-dragging={isDragSource || undefined}
      className={`group/card relative list-none snap-start transition-[box-shadow,border-color] duration-150 hover:border-line-strong motion-reduce:transition-none data-dragging:border-dashed data-dragging:border-accent data-dragging:bg-accent-subtle data-dragging:shadow-none ${CARD_SHELL_CLASSES}`}
    >
      {/* Covers the whole card, so the whole card can be dragged and clicked, with one tab stop. The content
          sits above it without taking pointer events; only the menu button takes them. */}
      <button
        ref={handleRef}
        type="button"
        data-kanban-handle={id}
        aria-label={describeCard(card, labels, members, now, isDone)}
        className="absolute inset-0 cursor-grab appearance-none rounded-md border-0 bg-transparent p-0 outline-offset-1 outline-focus focus-visible:outline-2 active:cursor-grabbing"
        onClick={() => {
          // The click that ends a mouse drag lands here too.
          if (!isDragActive()) openDialog({ kind: 'card', cardId: id })
        }}
      />
      <div className="pointer-events-none relative in-data-dragging:invisible">
        <CardFace
          card={card}
          labels={labels}
          members={members}
          now={now}
          isDone={isDone}
        />
      </div>
      <div className="absolute end-2 top-2 in-data-dragging:invisible">
        <CardMenu card={card} columnId={columnId} />
      </div>
    </li>
  )
})
