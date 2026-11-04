import { CollisionPriority } from '@dnd-kit/abstract'
import { SortableKeyboardPlugin } from '@dnd-kit/dom/sortable'
import { useSortable } from '@dnd-kit/react/sortable'
import type { ColumnId } from '../types'

const PLUGINS = [SortableKeyboardPlugin]

/**
 * A column is both a sortable and the drop target for cards. A card wins over a column it sits in, so the
 * column's priority is low, except when it shows no cards: at low priority, keyboard moves would skip it.
 */
export function useSortableColumn(
  id: ColumnId,
  index: number,
  isEmpty: boolean,
) {
  const { ref, handleRef, isDragSource, isDropTarget } = useSortable({
    id,
    index,
    type: 'column',
    accept: ['card', 'column'],
    collisionPriority: isEmpty
      ? CollisionPriority.Normal
      : CollisionPriority.Low,
    plugins: PLUGINS,
  })
  return { ref, handleRef, isDragSource, isDropTarget }
}
