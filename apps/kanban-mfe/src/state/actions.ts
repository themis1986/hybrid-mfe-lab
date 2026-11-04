import type { Card, CardId, CardPatch, Column, ColumnId } from '../types'

// Every change to the board is one of these. Ids and timestamps are in the action, made before dispatch,
// so the reducer stays pure and replaying an action gives the same board.
export type BoardAction =
  | { type: 'card/create'; card: Card; columnId: ColumnId; index?: number }
  | { type: 'card/update'; cardId: CardId; patch: CardPatch }
  | { type: 'card/delete'; cardId: CardId }
  | { type: 'card/duplicate'; sourceId: CardId; copy: Card }
  /** `toIndex` is the card's final index in the target column. */
  | { type: 'card/move'; cardId: CardId; toColumnId: ColumnId; toIndex: number }
  | { type: 'column/create'; column: Column }
  | { type: 'column/rename'; columnId: ColumnId; title: string }
  | { type: 'column/setWipLimit'; columnId: ColumnId; wipLimit: number | null }
  /** `moveCardsTo: null` deletes the column's cards with it. */
  | { type: 'column/delete'; columnId: ColumnId; moveCardsTo: ColumnId | null }
  | { type: 'column/move'; columnId: ColumnId; toIndex: number }
  /** Several changes as one: one history entry, so one Undo. */
  | { type: 'batch'; actions: BoardAction[] }
