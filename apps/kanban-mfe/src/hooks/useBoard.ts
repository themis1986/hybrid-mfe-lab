import { useBoardStoreSelector } from '../state/StoreContext'
import type { Board, Card, CardId, Column, ColumnId } from '../types'

const NOTHING = {}

/** The current board, for components that render only once it has loaded. */
export function useBoard(): Board {
  const board = useBoardStoreSelector((state) =>
    state.status === 'ready' ? state.history.present : null,
  )
  if (!board) throw new Error('The board has not loaded yet.')
  return board
}

export function useHistoryFlags(): { canUndo: boolean; canRedo: boolean } {
  const canUndo = useBoardStoreSelector(
    (state) => state.status === 'ready' && state.history.past.length > 0,
  )
  const canRedo = useBoardStoreSelector(
    (state) => state.status === 'ready' && state.history.future.length > 0,
  )
  return { canUndo, canRedo }
}

// Narrow reads: a component that uses one re-renders only when that part of the board changes.

export function useCard(id: CardId): Card | undefined {
  return useBoardStoreSelector((state) =>
    state.status === 'ready' ? state.history.present.cards[id] : undefined,
  )
}

export function useColumn(id: ColumnId): Column | undefined {
  return useBoardStoreSelector((state) =>
    state.status === 'ready' ? state.history.present.columns[id] : undefined,
  )
}

export function useLabels(): Board['labels'] {
  return useBoardStoreSelector((state) =>
    state.status === 'ready' ? state.history.present.labels : NOTHING,
  )
}

export function useMembers(): Board['members'] {
  return useBoardStoreSelector((state) =>
    state.status === 'ready' ? state.history.present.members : NOTHING,
  )
}

/** The last column counts as finished (see lib/board.ts). */
export function useIsLastColumn(id: ColumnId): boolean {
  return useBoardStoreSelector(
    (state) =>
      state.status === 'ready' &&
      state.history.present.columnIds.length > 1 &&
      state.history.present.columnIds.at(-1) === id,
  )
}
