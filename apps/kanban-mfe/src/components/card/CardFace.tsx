import { TIcon } from '@repo/ui'
import { CalendarDays, ListChecks } from '@repo/ui/icons'
import { checklistProgress } from '../../lib/board'
import { formatDueDate, isOverdue } from '../../lib/dates'
import { PRIORITY_DISPLAY, PRIORITY_LABELS } from '../../lib/presentation'
import type { Board, Card } from '../../types'
import { Avatar } from '../common/Avatar'
import { LabelChip } from '../common/LabelChip'

// What a card shows, on the board and in the drag preview. Purely visual: on the board, the button over it
// carries the same information for a screen reader.
export function CardFace({
  card,
  labels,
  members,
  now,
  isDone,
}: {
  card: Card
  labels: Board['labels']
  members: Board['members']
  now: string
  isDone: boolean
}) {
  const assignee = card.assigneeId ? members[card.assigneeId] : undefined
  const progress = checklistProgress(card)
  const overdue = !isDone && !!card.dueDate && isOverdue(card.dueDate, now)
  const priority =
    card.priority === 'none' ? null : PRIORITY_DISPLAY[card.priority]
  const hasMeta =
    !!priority || !!card.dueDate || progress.total > 0 || !!assignee

  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      {card.labelIds.length > 0 && (
        <div className="flex flex-wrap gap-1 pe-6">
          {card.labelIds.map((id) => {
            const label = labels[id]
            return label ? <LabelChip key={id} label={label} /> : null
          })}
        </div>
      )}
      <p
        className={`m-0 text-sm leading-snug font-medium wrap-anywhere text-fg ${card.labelIds.length > 0 ? '' : 'pe-6'}`}
      >
        {card.title}
      </p>
      {hasMeta && (
        <div className="flex min-h-6 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
          {priority && (
            <span
              className={`inline-flex items-center gap-0.5 ${priority.className}`}
            >
              <TIcon icon={priority.icon} size="sm" />
              {PRIORITY_LABELS[card.priority]}
            </span>
          )}
          {card.dueDate && (
            <span
              className={`inline-flex items-center gap-1 ${overdue ? 'font-medium text-danger-fg' : ''}`}
            >
              <TIcon icon={CalendarDays} size="sm" />
              {formatDueDate(card.dueDate, now)}
            </span>
          )}
          {progress.total > 0 && (
            <span
              className={`inline-flex items-center gap-1 ${progress.done === progress.total ? 'text-success-fg' : ''}`}
            >
              <TIcon icon={ListChecks} size="sm" />
              {progress.done}/{progress.total}
            </span>
          )}
          {assignee && (
            <span className="ms-auto">
              <Avatar name={assignee.name} />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
