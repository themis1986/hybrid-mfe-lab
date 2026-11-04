import type { BoardAction } from '../state/actions'
import type { Board, Card } from '../types'
import { formatDueDate, isOverdue } from './dates'
import { PRIORITY_LABELS } from './presentation'

/**
 * The Undo toast's text for an action, or null when the action gets no toast: moves and destructive
 * actions do, since those are the ones that are easy to do by accident.
 */
export function describeUndoable(
  action: BoardAction,
  before: Board,
): string | null {
  switch (action.type) {
    case 'card/delete': {
      const card = before.cards[action.cardId]
      return card ? `Deleted “${card.title}”` : null
    }
    case 'card/move': {
      const card = before.cards[action.cardId]
      const column = before.columns[action.toColumnId]
      if (!card || !column) return null
      return column.cardIds.includes(card.id)
        ? `Moved “${card.title}” within ${column.title}`
        : `Moved “${card.title}” to ${column.title}`
    }
    case 'column/move': {
      const column = before.columns[action.columnId]
      return column ? `Moved column “${column.title}”` : null
    }
    case 'column/delete': {
      const column = before.columns[action.columnId]
      if (!column) return null
      const count = column.cardIds.length
      const cards = `${count} card${count === 1 ? '' : 's'}`
      if (count === 0) return `Deleted column “${column.title}”`
      const target = action.moveCardsTo && before.columns[action.moveCardsTo]
      return target
        ? `Deleted column “${column.title}” and moved ${cards} to ${target.title}`
        : `Deleted column “${column.title}” and ${cards}`
    }
    case 'batch':
      for (const inner of action.actions) {
        const text = describeUndoable(inner, before)
        if (text) return text
      }
      return null
    default:
      return null
  }
}

/** What a screen reader hears for a card on the board, as one line. */
export function describeCard(
  card: Card,
  labels: Board['labels'],
  members: Board['members'],
  now: string,
  isDone: boolean,
): string {
  const parts = [card.title]
  if (card.priority !== 'none') {
    parts.push(`${PRIORITY_LABELS[card.priority]} priority`)
  }
  const labelNames = card.labelIds.flatMap((id) => labels[id]?.name ?? [])
  if (labelNames.length > 0) parts.push(`Labels: ${labelNames.join(', ')}`)
  const assignee = card.assigneeId ? members[card.assigneeId] : undefined
  if (assignee) parts.push(`Assigned to ${assignee.name}`)
  if (card.dueDate) {
    const overdue = !isDone && isOverdue(card.dueDate, now)
    parts.push(
      `${overdue ? 'Overdue, was due' : 'Due'} ${formatDueDate(card.dueDate, now)}`,
    )
  }
  if (card.checklist.length > 0) {
    const done = card.checklist.filter((item) => item.done).length
    parts.push(`Checklist ${done} of ${card.checklist.length} done`)
  }
  return parts.join('. ')
}
