// The board's data model, normalised: cards and columns are looked up by id, and order lives only in
// `columnIds` and each column's `cardIds`. Everything here is plain data, so it can cross a repository.
export type CardId = string
export type ColumnId = string
export type LabelId = string
export type MemberId = string

export const PRIORITIES = ['none', 'low', 'medium', 'high', 'urgent'] as const
export type Priority = (typeof PRIORITIES)[number]

export type LabelTone =
  'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger'

export interface Label {
  id: LabelId
  name: string
  tone: LabelTone
}

export interface Member {
  id: MemberId
  name: string
}

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface Card {
  id: CardId
  title: string
  description: string
  priority: Priority
  labelIds: LabelId[]
  assigneeId: MemberId | null
  /** ISO date, e.g. "2026-11-01". */
  dueDate: string | null
  checklist: ChecklistItem[]
  createdAt: string
}

/** What the detail form can change. */
export type CardPatch = Partial<
  Pick<
    Card,
    | 'title'
    | 'description'
    | 'priority'
    | 'labelIds'
    | 'assigneeId'
    | 'dueDate'
    | 'checklist'
  >
>

export interface Column {
  id: ColumnId
  title: string
  cardIds: CardId[]
  /** Above this many cards the column shows a warning; it never blocks a move. */
  wipLimit: number | null
}

export interface Board {
  id: string
  title: string
  columnIds: ColumnId[]
  columns: Record<ColumnId, Column>
  cards: Record<CardId, Card>
  labels: Record<LabelId, Label>
  members: Record<MemberId, Member>
}
