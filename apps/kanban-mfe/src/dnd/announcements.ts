import { type CardDraft, findDraftColumn } from '../lib/order'
import type { Board, ColumnId } from '../types'
import type { DragItem } from './BoardDnd'

// What a screen reader hears during a drag: real titles and positions, not the library's generic ids.
export const KEYBOARD_INSTRUCTIONS =
  'Press Space to pick up. While dragging, use the arrow keys to move, Space to drop, and Escape to cancel. On a card, Enter opens its details.'

function cardTitle(board: Board, id: string): string {
  return board.cards[id]?.title ?? 'Card'
}

function columnTitle(board: Board, id: string): string {
  return board.columns[id]?.title ?? 'Column'
}

function cardPosition(draft: CardDraft, cardId: string, board: Board): string {
  const columnId = findDraftColumn(draft, cardId)
  if (!columnId) return ''
  const list = draft[columnId]!
  return `position ${list.indexOf(cardId) + 1} of ${list.length} in ${columnTitle(board, columnId)}`
}

function columnPosition(order: readonly ColumnId[], id: string): string {
  return `position ${order.indexOf(id) + 1} of ${order.length}`
}

export function announcePickUp(
  board: Board,
  shown: CardDraft,
  item: DragItem,
): string {
  return item.kind === 'card'
    ? `Picked up ${cardTitle(board, item.id)}, ${cardPosition(shown, item.id, board)}.`
    : `Picked up column ${columnTitle(board, item.id)}, ${columnPosition(board.columnIds, item.id)}.`
}

export function announceMove(
  board: Board,
  item: DragItem,
  draft: CardDraft | null,
  order: readonly ColumnId[] | null,
): string {
  if (item.kind === 'card' && draft) {
    return `${cardTitle(board, item.id)} is now at ${cardPosition(draft, item.id, board)}.`
  }
  return `Column ${columnTitle(board, item.id)} is now at ${columnPosition(order ?? board.columnIds, item.id)}.`
}

export function announceDrop(
  board: Board,
  item: DragItem,
  canceled: boolean,
  draft: CardDraft | null,
  order: readonly ColumnId[] | null,
): string {
  const name =
    item.kind === 'card'
      ? cardTitle(board, item.id)
      : `Column ${columnTitle(board, item.id)}`
  if (canceled) return `Move canceled. ${name} returned to where it was.`
  if (item.kind === 'card') {
    return draft
      ? `Dropped ${name} at ${cardPosition(draft, item.id, board)}.`
      : `Dropped ${name}.`
  }
  return `Dropped ${name} at ${columnPosition(order ?? board.columnIds, item.id)}.`
}
