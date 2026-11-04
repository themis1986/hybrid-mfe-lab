import type { CardId, ColumnId } from '../types'

/**
 * The final index of a dropped card in its column's real list, given the order the board showed at the
 * drop. With filters on, the board shows only some of the cards, so the shown index can't be used as it
 * is: the card goes right before its shown successor or, at the end, right after its shown predecessor.
 */
export function resolveDropIndex(
  realIds: readonly CardId[],
  shownIds: readonly CardId[],
  cardId: CardId,
): number {
  const rest = realIds.filter((id) => id !== cardId)
  const shownAt = shownIds.indexOf(cardId)

  const next = rest.indexOf(shownIds[shownAt + 1] ?? '')
  if (next !== -1) return next

  const previous = rest.indexOf(shownIds[shownAt - 1] ?? '')
  return previous !== -1 ? previous + 1 : rest.length
}

/** The cards a drag is showing, by column. Every column has a key, also an empty one. */
export type CardDraft = Readonly<Record<ColumnId, readonly CardId[]>>

export type DropTarget =
  /** Over a card: takes its place. `below`: the dragged card's centre is below the target's. */
  | { kind: 'card'; id: CardId; below: boolean }
  /** Over a column but no card in it: to the top of the column, or to its end. */
  | { kind: 'column'; id: ColumnId; atTop: boolean }

export function findDraftColumn(
  draft: CardDraft,
  cardId: CardId,
): ColumnId | undefined {
  return Object.keys(draft).find((id) => draft[id]!.includes(cardId))
}

function arrayMove<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list]
  next.splice(to, 0, ...next.splice(from, 1))
  return next
}

/**
 * The next draft while dragging a card over a target. Returns the same object when nothing moves, and
 * shares the columns it doesn't touch, so only the affected columns re-render.
 */
export function moveCardInDraft(
  draft: CardDraft,
  cardId: CardId,
  target: DropTarget,
): CardDraft {
  if (target.id === cardId) return draft
  const fromColumn = findDraftColumn(draft, cardId)
  const toColumn =
    target.kind === 'column' ? target.id : findDraftColumn(draft, target.id)
  if (!fromColumn || !toColumn) return draft

  const from = draft[fromColumn]!
  const to = draft[toColumn]!
  const fromIndex = from.indexOf(cardId)

  if (fromColumn === toColumn) {
    const toIndex =
      target.kind === 'card'
        ? to.indexOf(target.id)
        : target.atTop
          ? 0
          : to.length - 1
    if (toIndex === fromIndex) return draft
    return { ...draft, [toColumn]: arrayMove(to, fromIndex, toIndex) }
  }

  const toIndex =
    target.kind === 'card'
      ? to.indexOf(target.id) + (target.below ? 1 : 0)
      : target.atTop
        ? 0
        : to.length
  return {
    ...draft,
    [fromColumn]: from.filter((id) => id !== cardId),
    [toColumn]: [...to.slice(0, toIndex), cardId, ...to.slice(toIndex)],
  }
}

/** The next column order while dragging a column over another. */
export function moveColumnInOrder(
  order: readonly ColumnId[],
  columnId: ColumnId,
  targetId: ColumnId,
): readonly ColumnId[] {
  const from = order.indexOf(columnId)
  const to = order.indexOf(targetId)
  if (from === -1 || to === -1 || from === to) return order
  return arrayMove(order, from, to)
}
