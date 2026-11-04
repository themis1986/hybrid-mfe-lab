import type {
  Board,
  Card,
  CardId,
  ColumnId,
  LabelId,
  MemberId,
  Priority,
} from '../types'

/** The assignee filter's value for cards with nobody assigned. */
export const UNASSIGNED = 'unassigned'

export interface BoardFilters {
  search: string
  labelIds: LabelId[]
  assigneeIds: (MemberId | typeof UNASSIGNED)[]
  priorities: Priority[]
}

export const NO_FILTERS: BoardFilters = {
  search: '',
  labelIds: [],
  assigneeIds: [],
  priorities: [],
}

export function hasActiveFilters(filters: BoardFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.labelIds.length > 0 ||
    filters.assigneeIds.length > 0 ||
    filters.priorities.length > 0
  )
}

// Filters of different kinds narrow each other; values within one filter widen it.
export function matchesFilters(
  card: Card,
  filters: BoardFilters,
  board: Board,
): boolean {
  const search = filters.search.trim().toLowerCase()
  if (search) {
    const haystack = [
      card.title,
      card.description,
      ...card.labelIds.map((id) => board.labels[id]?.name ?? ''),
      card.assigneeId ? (board.members[card.assigneeId]?.name ?? '') : '',
    ]
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(search)) return false
  }
  if (
    filters.labelIds.length > 0 &&
    !filters.labelIds.some((id) => card.labelIds.includes(id))
  ) {
    return false
  }
  if (
    filters.assigneeIds.length > 0 &&
    !filters.assigneeIds.includes(card.assigneeId ?? UNASSIGNED)
  ) {
    return false
  }
  if (
    filters.priorities.length > 0 &&
    !filters.priorities.includes(card.priority)
  ) {
    return false
  }
  return true
}

/** The cards the filters leave on the board, by column. Without filters, the columns' own lists. */
export function getVisibleCardIds(
  board: Board,
  filters: BoardFilters,
): Record<ColumnId, readonly CardId[]> {
  const active = hasActiveFilters(filters)
  return Object.fromEntries(
    board.columnIds.map((id) => {
      const { cardIds } = board.columns[id]!
      return [
        id,
        active
          ? cardIds.filter((cardId) =>
              matchesFilters(board.cards[cardId]!, filters, board),
            )
          : cardIds,
      ]
    }),
  )
}
