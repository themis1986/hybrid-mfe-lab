import { useMemo } from 'react'
import { createId } from '../lib/ids'
import type { BoardAction } from '../state/actions'
import { useBoardStore } from '../state/StoreContext'
import type { Card, CardId, CardPatch, Column, ColumnId } from '../types'

export type NewCard = Pick<Card, 'title'> & CardPatch

// What components call to change the board. Ids and timestamps are made here, before dispatch, so the
// reducer stays pure.
export function useBoardActions() {
  const store = useBoardStore()

  return useMemo(() => {
    const dispatch = (action: BoardAction) => store.dispatch(action)

    return {
      createCard(columnId: ColumnId, fields: NewCard, index?: number) {
        const card: Card = {
          id: createId('card'),
          description: '',
          priority: 'none',
          labelIds: [],
          assigneeId: null,
          dueDate: null,
          checklist: [],
          createdAt: new Date().toISOString(),
          ...fields,
        }
        dispatch({ type: 'card/create', card, columnId, index })
        return card.id
      },

      /** With `moveTo`, the edit and the move count as one change: one Undo reverts both. */
      updateCard(
        cardId: CardId,
        patch: CardPatch,
        moveTo?: { columnId: ColumnId; index: number },
      ) {
        const update: BoardAction = { type: 'card/update', cardId, patch }
        dispatch(
          moveTo
            ? {
                type: 'batch',
                actions: [
                  update,
                  {
                    type: 'card/move',
                    cardId,
                    toColumnId: moveTo.columnId,
                    toIndex: moveTo.index,
                  },
                ],
              }
            : update,
        )
      },

      deleteCard(cardId: CardId) {
        dispatch({ type: 'card/delete', cardId })
      },

      duplicateCard(source: Card) {
        const copy: Card = {
          ...source,
          id: createId('card'),
          title: `${source.title} (copy)`,
          checklist: source.checklist.map((item) => ({
            ...item,
            id: createId('check'),
          })),
          createdAt: new Date().toISOString(),
        }
        dispatch({ type: 'card/duplicate', sourceId: source.id, copy })
        return copy.id
      },

      moveCard(cardId: CardId, toColumnId: ColumnId, toIndex: number) {
        dispatch({ type: 'card/move', cardId, toColumnId, toIndex })
      },

      createColumn(title: string) {
        const column: Column = {
          id: createId('column'),
          title,
          cardIds: [],
          wipLimit: null,
        }
        dispatch({ type: 'column/create', column })
        return column.id
      },

      renameColumn(columnId: ColumnId, title: string) {
        dispatch({ type: 'column/rename', columnId, title })
      },

      setWipLimit(columnId: ColumnId, wipLimit: number | null) {
        dispatch({ type: 'column/setWipLimit', columnId, wipLimit })
      },

      deleteColumn(columnId: ColumnId, moveCardsTo: ColumnId | null) {
        dispatch({ type: 'column/delete', columnId, moveCardsTo })
      },

      moveColumn(columnId: ColumnId, toIndex: number) {
        dispatch({ type: 'column/move', columnId, toIndex })
      },

      undo: store.undo,
      redo: store.redo,
    }
  }, [store])
}
