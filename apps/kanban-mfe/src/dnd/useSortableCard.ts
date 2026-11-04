import { SortableKeyboardPlugin } from '@dnd-kit/dom/sortable'
import { useSortable } from '@dnd-kit/react/sortable'
import type { CardId, ColumnId } from '../types'

// The default OptimisticSortingPlugin moves DOM nodes itself. The board's draft already moves them through
// React, and two owners of the same nodes can make React throw on the next commit.
const PLUGINS = [SortableKeyboardPlugin]

export function useSortableCard(id: CardId, index: number, columnId: ColumnId) {
  const { ref, handleRef, isDragSource } = useSortable({
    id,
    index,
    group: columnId,
    type: 'card',
    accept: 'card',
    plugins: PLUGINS,
  })
  return { ref, handleRef, isDragSource }
}
