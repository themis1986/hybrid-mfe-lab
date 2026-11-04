import { findCardColumn } from '../lib/board'
import type { Board, CardId, Column, ColumnId } from '../types'
import type { BoardAction } from './actions'

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(value, max))
}

function insertAt<T>(list: readonly T[], item: T, index: number): T[] {
  const at = clamp(index, list.length)
  return [...list.slice(0, at), item, ...list.slice(at)]
}

function setColumn(board: Board, column: Column): Board {
  return { ...board, columns: { ...board.columns, [column.id]: column } }
}

function withoutCards(board: Board, ids: readonly CardId[]): Board['cards'] {
  const cards = { ...board.cards }
  for (const id of ids) delete cards[id]
  return cards
}

/**
 * The one place the board changes. Pure and framework-free. An action that changes nothing (an unknown id,
 * a move to where the card already is) returns the same object, so it adds no history entry.
 */
export function boardReducer(board: Board, action: BoardAction): Board {
  switch (action.type) {
    case 'card/create': {
      const column = board.columns[action.columnId]
      if (!column) return board
      const index = action.index ?? column.cardIds.length
      return {
        ...setColumn(board, {
          ...column,
          cardIds: insertAt(column.cardIds, action.card.id, index),
        }),
        cards: { ...board.cards, [action.card.id]: action.card },
      }
    }

    case 'card/update': {
      const card = board.cards[action.cardId]
      if (!card) return board
      return {
        ...board,
        cards: { ...board.cards, [card.id]: { ...card, ...action.patch } },
      }
    }

    case 'card/delete': {
      const column = findCardColumn(board, action.cardId)
      if (!column) return board
      return {
        ...setColumn(board, {
          ...column,
          cardIds: column.cardIds.filter((id) => id !== action.cardId),
        }),
        cards: withoutCards(board, [action.cardId]),
      }
    }

    case 'card/duplicate': {
      const column = findCardColumn(board, action.sourceId)
      if (!column) return board
      const index = column.cardIds.indexOf(action.sourceId) + 1
      return {
        ...setColumn(board, {
          ...column,
          cardIds: insertAt(column.cardIds, action.copy.id, index),
        }),
        cards: { ...board.cards, [action.copy.id]: action.copy },
      }
    }

    case 'card/move': {
      const from = findCardColumn(board, action.cardId)
      const to = board.columns[action.toColumnId]
      if (!from || !to) return board

      if (from.id === to.id) {
        const rest = from.cardIds.filter((id) => id !== action.cardId)
        const index = clamp(action.toIndex, rest.length)
        if (from.cardIds[index] === action.cardId) return board
        return setColumn(board, {
          ...from,
          cardIds: insertAt(rest, action.cardId, index),
        })
      }

      return {
        ...board,
        columns: {
          ...board.columns,
          [from.id]: {
            ...from,
            cardIds: from.cardIds.filter((id) => id !== action.cardId),
          },
          [to.id]: {
            ...to,
            cardIds: insertAt(to.cardIds, action.cardId, action.toIndex),
          },
        },
      }
    }

    case 'column/create':
      return {
        ...setColumn(board, action.column),
        columnIds: [...board.columnIds, action.column.id],
      }

    case 'column/rename': {
      const column = board.columns[action.columnId]
      if (!column || column.title === action.title) return board
      return setColumn(board, { ...column, title: action.title })
    }

    case 'column/setWipLimit': {
      const column = board.columns[action.columnId]
      if (!column || column.wipLimit === action.wipLimit) return board
      return setColumn(board, { ...column, wipLimit: action.wipLimit })
    }

    case 'column/delete':
      return deleteColumn(board, action.columnId, action.moveCardsTo)

    case 'column/move': {
      const rest = board.columnIds.filter((id) => id !== action.columnId)
      if (rest.length === board.columnIds.length) return board
      const index = clamp(action.toIndex, rest.length)
      if (board.columnIds[index] === action.columnId) return board
      return {
        ...board,
        columnIds: insertAt(rest, action.columnId, index),
      }
    }

    case 'batch':
      return action.actions.reduce(boardReducer, board)
  }
}

function deleteColumn(
  board: Board,
  columnId: ColumnId,
  moveCardsTo: ColumnId | null,
): Board {
  const column = board.columns[columnId]
  if (!column) return board

  const columns = { ...board.columns }
  delete columns[columnId]
  const target = moveCardsTo === null ? undefined : columns[moveCardsTo]
  if (target) {
    columns[target.id] = {
      ...target,
      cardIds: [...target.cardIds, ...column.cardIds],
    }
  }

  return {
    ...board,
    columnIds: board.columnIds.filter((id) => id !== columnId),
    columns,
    cards: target ? board.cards : withoutCards(board, column.cardIds),
  }
}
