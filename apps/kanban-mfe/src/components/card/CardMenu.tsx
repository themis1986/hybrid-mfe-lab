import {
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuGroup,
  TDropdownMenuItem,
  TDropdownMenuLabel,
  TDropdownMenuSeparator,
  TDropdownMenuTrigger,
} from '@repo/ui'
import { Ellipsis } from '@repo/ui/icons'
import { useBoard } from '../../hooks/useBoard'
import { useBoardActions } from '../../hooks/useBoardActions'
import { useDialogs } from '../../hooks/useDialogs'
import type { Card, ColumnId } from '../../types'
import { IconButton } from '../common/IconButton'

// Mounted only while the menu is open, so a card doesn't re-render whenever any column changes.
function CardMenuItems({ card, columnId }: { card: Card; columnId: ColumnId }) {
  const board = useBoard()
  const { openDialog } = useDialogs()
  const { deleteCard, duplicateCard, moveCard } = useBoardActions()
  const otherColumns = board.columnIds.filter((id) => id !== columnId)

  return (
    <TDropdownMenuContent align="end">
      <TDropdownMenuItem
        onSelect={() => openDialog({ kind: 'card', cardId: card.id })}
      >
        Open
      </TDropdownMenuItem>
      <TDropdownMenuItem onSelect={() => duplicateCard(card)}>
        Duplicate
      </TDropdownMenuItem>
      {/* The way to move a card without dragging, for anyone who can't or would rather not. */}
      {otherColumns.length > 0 && (
        <>
          <TDropdownMenuSeparator />
          <TDropdownMenuGroup>
            <TDropdownMenuLabel>Move to</TDropdownMenuLabel>
            {otherColumns.map((id) => {
              const column = board.columns[id]!
              return (
                <TDropdownMenuItem
                  key={id}
                  onSelect={() => moveCard(card.id, id, column.cardIds.length)}
                >
                  {column.title}
                </TDropdownMenuItem>
              )
            })}
          </TDropdownMenuGroup>
        </>
      )}
      <TDropdownMenuSeparator />
      <TDropdownMenuItem tone="danger" onSelect={() => deleteCard(card.id)}>
        Delete
      </TDropdownMenuItem>
    </TDropdownMenuContent>
  )
}

export function CardMenu({
  card,
  columnId,
}: {
  card: Card
  columnId: ColumnId
}) {
  return (
    <TDropdownMenu>
      <TDropdownMenuTrigger asChild>
        <IconButton
          icon={Ellipsis}
          label={`Actions for ${card.title}`}
          className="h-6 w-6 opacity-0 group-focus-within/card:opacity-100 group-hover/card:opacity-100 pointer-coarse:opacity-100 aria-expanded:opacity-100"
        />
      </TDropdownMenuTrigger>
      <CardMenuItems card={card} columnId={columnId} />
    </TDropdownMenu>
  )
}
