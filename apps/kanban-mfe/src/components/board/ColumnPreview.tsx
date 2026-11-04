import { useId } from 'react'
import { useColumn } from '../../hooks/useBoard'
import type { ColumnId } from '../../types'
import { ColumnHeader } from './ColumnHeader'
import { COLUMN_SHELL_CLASSES } from './BoardColumn'

/** The column under the pointer during a drag: just its header, since a whole column is a lot to carry. */
export function ColumnPreview({ id }: { id: ColumnId }) {
  const column = useColumn(id)
  const headingId = useId()
  if (!column) return null

  return (
    <div
      className={`cursor-grabbing pb-2 text-fg shadow-lg motion-safe:rotate-1 ${COLUMN_SHELL_CLASSES}`}
    >
      <ColumnHeader column={column} headingId={headingId} />
    </div>
  )
}
