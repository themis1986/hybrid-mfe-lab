import type { Board, Card, CardId, Column } from '../types'
import { isOverdue } from './dates'

// Plain reads over the board.

export function findCardColumn(
  board: Board,
  cardId: CardId,
): Column | undefined {
  return board.columnIds
    .map((id) => board.columns[id]!)
    .find((column) => column.cardIds.includes(cardId))
}

/** The last column counts as finished: its cards are done and are never overdue. */
export function isDoneColumn(board: Board, column: Column): boolean {
  return board.columnIds.length > 1 && board.columnIds.at(-1) === column.id
}

export function checklistProgress(card: Card): { done: number; total: number } {
  return {
    done: card.checklist.filter((item) => item.done).length,
    total: card.checklist.length,
  }
}

export interface BoardSummary {
  total: number
  done: number
  overdue: number
}

export function summarizeBoard(board: Board, now: string): BoardSummary {
  let total = 0
  let done = 0
  let overdue = 0
  for (const id of board.columnIds) {
    const column = board.columns[id]!
    const isDone = isDoneColumn(board, column)
    total += column.cardIds.length
    if (isDone) done += column.cardIds.length
    else {
      overdue += column.cardIds.filter((cardId) => {
        const due = board.cards[cardId]?.dueDate
        return !!due && isOverdue(due, now)
      }).length
    }
  }
  return { total, done, overdue }
}
