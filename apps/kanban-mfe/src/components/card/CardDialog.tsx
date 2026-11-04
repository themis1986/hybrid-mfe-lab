import {
  TButton,
  TCombobox,
  TDatePicker,
  TDialog,
  TDialogBody,
  TDialogClose,
  TDialogContent,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
  TField,
  TSelect,
  TSpacer,
  TText,
} from '@repo/ui'
import { type FormEvent, type ReactNode, useId, useMemo, useRef } from 'react'
import { focusHandle } from '../../dnd/BoardDnd'
import { useBoard } from '../../hooks/useBoard'
import { useBoardActions } from '../../hooks/useBoardActions'
import { type CardFormValues, useCardForm } from '../../hooks/useCardForm'
import { useDialogs } from '../../hooks/useDialogs'
import { findCardColumn } from '../../lib/board'
import { PRIORITY_LABELS } from '../../lib/presentation'
import { type Card, type ColumnId, PRIORITIES } from '../../types'
import { ChecklistEditor } from './ChecklistEditor'

const UNASSIGNED_OPTION = '__unassigned'

function Row({
  label,
  htmlFor,
  labelId,
  children,
}: {
  label: string
  htmlFor?: string
  labelId?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label
        id={labelId}
        htmlFor={htmlFor}
        className="text-sm font-medium text-fg"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function CardForm({
  initial,
  mode,
  card,
}: {
  initial: CardFormValues
  mode: 'new' | 'edit'
  card?: Card
}) {
  const id = useId()
  const board = useBoard()
  const { closeDialog } = useDialogs()
  const { createCard, updateCard, deleteCard, duplicateCard } =
    useBoardActions()
  const form = useCardForm(initial)
  const { values, setField } = form

  const columnOptions = board.columnIds.map((columnId) => ({
    value: columnId,
    label: board.columns[columnId]!.title,
  }))
  const priorityOptions = PRIORITIES.map((value) => ({
    value,
    label: PRIORITY_LABELS[value],
  }))
  const assigneeOptions = [
    { value: UNASSIGNED_OPTION, label: 'Unassigned' },
    ...Object.values(board.members).map((member) => ({
      value: member.id,
      label: member.name,
    })),
  ]
  const labelOptions = Object.values(board.labels).map((label) => ({
    value: label.id,
    label: label.name,
  }))

  function save(event: FormEvent) {
    event.preventDefault()
    const result = form.submit()
    if (!result) return
    const { columnId, ...fields } = result

    if (mode === 'new') {
      createCard(columnId, fields)
    } else if (card) {
      updateCard(
        card.id,
        fields,
        columnId === initial.columnId
          ? undefined
          : { columnId, index: board.columns[columnId]!.cardIds.length },
      )
    }
    closeDialog()
  }

  return (
    // noValidate: the form shows its own messages rather than the browser's bubbles.
    <form noValidate onSubmit={save} className="contents">
      <TDialogHeader>
        <TDialogTitle>{mode === 'new' ? 'New card' : 'Edit card'}</TDialogTitle>
      </TDialogHeader>
      <TDialogBody>
        {/* The body scrolls, which clips whatever passes its edge: the padding keeps the focus rings whole. */}
        <div className="flex flex-col gap-4 p-1">
          <TField
            label="Title"
            value={values.title}
            required
            error={form.titleError}
            onChange={(event) => setField('title', event.target.value)}
          />
          <TText
            label="Description"
            value={values.description}
            rows={3}
            autoResize
            maxRows={10}
            onChange={(event) => setField('description', event.target.value)}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-4">
            <Row label="Column" htmlFor={`${id}-column`}>
              <TSelect
                id={`${id}-column`}
                options={columnOptions}
                value={values.columnId}
                onValueChange={(value: ColumnId) => setField('columnId', value)}
              />
            </Row>
            <Row label="Priority" htmlFor={`${id}-priority`}>
              <TSelect
                id={`${id}-priority`}
                options={priorityOptions}
                value={values.priority}
                onValueChange={(value) =>
                  setField('priority', value as Card['priority'])
                }
              />
            </Row>
            <Row label="Assignee" htmlFor={`${id}-assignee`}>
              <TSelect
                id={`${id}-assignee`}
                options={assigneeOptions}
                value={values.assigneeId ?? UNASSIGNED_OPTION}
                onValueChange={(value) =>
                  setField(
                    'assigneeId',
                    value === UNASSIGNED_OPTION ? null : value,
                  )
                }
              />
            </Row>
            <Row label="Due date" labelId={`${id}-due`}>
              <div className="flex items-center gap-2">
                {/* '' and not undefined: while undefined, the picker counts as uncontrolled and keeps the
                    last date it showed, so clearing wouldn't take. */}
                <TDatePicker
                  aria-labelledby={`${id}-due`}
                  value={values.dueDate ?? ''}
                  className="min-w-0 flex-1"
                  onValueChange={(value) => setField('dueDate', value ?? null)}
                />
                {values.dueDate && (
                  <TButton
                    variant="ghost"
                    size="sm"
                    label="Clear"
                    onClick={() => setField('dueDate', null)}
                  />
                )}
              </div>
            </Row>
          </div>
          <Row label="Labels" labelId={`${id}-labels`}>
            <TCombobox
              multiple
              aria-labelledby={`${id}-labels`}
              options={labelOptions}
              value={values.labelIds}
              placeholder="Add labels"
              onValueChange={(value) => setField('labelIds', value)}
            />
          </Row>
          <ChecklistEditor
            items={values.checklist}
            onAdd={form.addChecklistItem}
            onUpdate={form.updateChecklistItem}
            onRemove={form.removeChecklistItem}
          />
        </div>
      </TDialogBody>
      <TDialogFooter>
        {card && (
          <>
            <TButton
              variant="danger"
              label="Delete"
              onClick={() => {
                deleteCard(card.id)
                closeDialog()
              }}
            />
            <TButton
              variant="ghost"
              label="Duplicate"
              onClick={() => {
                duplicateCard(card)
                closeDialog()
              }}
            />
          </>
        )}
        <TSpacer />
        <TDialogClose asChild>
          <TButton variant="ghost" label="Cancel" />
        </TDialogClose>
        <TButton type="submit" label={mode === 'new' ? 'Add card' : 'Save'} />
      </TDialogFooter>
    </form>
  )
}

/** The full form, for a new card and for editing one. Keyed by card, so reopening starts from what's saved. */
export function CardDialog() {
  const board = useBoard()
  const { dialog, closeDialog } = useDialogs()
  const lastCardId = useRef<string | null>(null)
  if (dialog?.kind === 'card') lastCardId.current = dialog.cardId

  const form = useMemo(() => {
    if (dialog?.kind === 'new-card') {
      const columnId = dialog.columnId ?? board.columnIds[0]
      if (!columnId) return null
      const initial: CardFormValues = {
        title: '',
        description: '',
        priority: 'none',
        labelIds: [],
        assigneeId: null,
        dueDate: null,
        checklist: [],
        columnId,
      }
      return { key: 'new', mode: 'new' as const, initial, card: undefined }
    }
    if (dialog?.kind === 'card') {
      const card = board.cards[dialog.cardId]
      const column = findCardColumn(board, dialog.cardId)
      if (!card || !column) return null
      const initial: CardFormValues = {
        title: card.title,
        description: card.description,
        priority: card.priority,
        labelIds: card.labelIds,
        assigneeId: card.assigneeId,
        dueDate: card.dueDate,
        checklist: card.checklist,
        columnId: column.id,
      }
      return { key: card.id, mode: 'edit' as const, initial, card }
    }
    return null
    // Only when another dialog opens: the form keeps its own values while it's open.
  }, [dialog])

  return (
    <TDialog
      open={!!form}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <TDialogContent
        size="lg"
        onCloseAutoFocus={(event) => {
          // A move to another column remounted the card, so the default return of focus would find nothing.
          // A deleted or filtered-out card has no handle: the default applies then.
          if (lastCardId.current && focusHandle(lastCardId.current)) {
            event.preventDefault()
          }
        }}
      >
        {form && (
          <CardForm
            key={form.key}
            initial={form.initial}
            mode={form.mode}
            card={form.card}
          />
        )}
      </TDialogContent>
    </TDialog>
  )
}
