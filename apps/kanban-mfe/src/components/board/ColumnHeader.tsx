import { TIcon, TInput } from '@repo/ui'
import { GripVertical, TriangleAlert } from '@repo/ui/icons'
import { useId, useState } from 'react'
import { useBoardActions } from '../../hooks/useBoardActions'
import type { Column } from '../../types'
import { ColumnMenu } from './ColumnMenu'

export function ColumnHeader({
  column,
  headingId,
  handleRef,
}: {
  column: Column
  headingId: string
  /** The grip that drags the column. Absent in the drag preview. */
  handleRef?: (element: Element | null) => void
}) {
  const { renameColumn } = useBoardActions()
  const inputId = useId()
  const [title, setTitle] = useState<string | null>(null)
  const count = column.cardIds.length
  const overLimit = column.wipLimit !== null && count > column.wipLimit

  function commit() {
    const next = title?.trim()
    if (next) renameColumn(column.id, next)
    setTitle(null)
  }

  return (
    <header className="flex flex-col gap-1 px-2 pt-2">
      <div className="flex min-h-7 items-center gap-1">
        {handleRef && (
          <button
            ref={handleRef}
            type="button"
            data-kanban-handle={column.id}
            aria-label={`Move column ${column.title}`}
            className="inline-flex h-7 w-5 shrink-0 cursor-grab appearance-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-fg-muted outline-offset-1 outline-focus hover:text-fg focus-visible:outline-2 active:cursor-grabbing"
          >
            <TIcon icon={GripVertical} size="sm" />
          </button>
        )}
        {title === null ? (
          <h2
            id={headingId}
            className="m-0 min-w-0 flex-1 truncate font-sans text-sm font-semibold text-fg"
          >
            {column.title}
          </h2>
        ) : (
          <TInput
            id={inputId}
            autoFocus
            size="sm"
            value={title}
            aria-label={`Rename column ${column.title}`}
            className="min-w-0 flex-1"
            onChange={(event) => setTitle(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commit()
              if (event.key === 'Escape') setTitle(null)
            }}
          />
        )}
        <span
          data-over-limit={overLimit || undefined}
          className="shrink-0 rounded-full bg-canvas px-1.5 text-xs leading-5 font-medium text-fg-muted tabular-nums data-over-limit:bg-warning-subtle data-over-limit:text-warning-fg"
          aria-label={
            column.wipLimit === null
              ? `${count} cards`
              : `${count} cards, limit ${column.wipLimit}`
          }
        >
          {column.wipLimit === null ? count : `${count}/${column.wipLimit}`}
        </span>
        {handleRef && (
          <ColumnMenu column={column} onRename={() => setTitle(column.title)} />
        )}
      </div>
      {overLimit && (
        <p className="m-0 flex items-center gap-1 px-1 text-xs text-warning-fg">
          <TIcon icon={TriangleAlert} size="sm" />
          Over the WIP limit by {count - column.wipLimit!}
        </p>
      )}
    </header>
  )
}
