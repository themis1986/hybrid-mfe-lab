import {
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuSeparator,
  TDropdownMenuTrigger,
} from '@repo/ui'
import { Ellipsis } from '@repo/ui/icons'
import { useBoard } from '../../hooks/useBoard'
import { useBoardActions } from '../../hooks/useBoardActions'
import { useDialogs } from '../../hooks/useDialogs'
import type { Column } from '../../types'
import { IconButton } from '../common/IconButton'

function ColumnMenuItems({
  column,
  onRename,
}: {
  column: Column
  onRename(): void
}) {
  const board = useBoard()
  const { openDialog } = useDialogs()
  const { moveColumn } = useBoardActions()
  const index = board.columnIds.indexOf(column.id)

  return (
    <TDropdownMenuContent align="end">
      <TDropdownMenuItem onSelect={onRename}>Rename</TDropdownMenuItem>
      <TDropdownMenuItem
        onSelect={() => openDialog({ kind: 'wip-limit', columnId: column.id })}
      >
        Set WIP limit
      </TDropdownMenuItem>
      {/* The way to reorder without dragging, for anyone who can't or would rather not. */}
      <TDropdownMenuSeparator />
      <TDropdownMenuItem
        disabled={index === 0}
        onSelect={() => moveColumn(column.id, index - 1)}
      >
        Move left
      </TDropdownMenuItem>
      <TDropdownMenuItem
        disabled={index === board.columnIds.length - 1}
        onSelect={() => moveColumn(column.id, index + 1)}
      >
        Move right
      </TDropdownMenuItem>
      <TDropdownMenuSeparator />
      <TDropdownMenuItem
        tone="danger"
        onSelect={() =>
          openDialog({ kind: 'delete-column', columnId: column.id })
        }
      >
        Delete column
      </TDropdownMenuItem>
    </TDropdownMenuContent>
  )
}

export function ColumnMenu({
  column,
  onRename,
}: {
  column: Column
  onRename(): void
}) {
  return (
    <TDropdownMenu>
      <TDropdownMenuTrigger asChild>
        <IconButton
          icon={Ellipsis}
          label={`Actions for column ${column.title}`}
          className="h-7 w-7"
        />
      </TDropdownMenuTrigger>
      <ColumnMenuItems column={column} onRename={onRename} />
    </TDropdownMenu>
  )
}
