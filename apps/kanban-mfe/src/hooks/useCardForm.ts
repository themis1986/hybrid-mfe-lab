import { useState } from 'react'
import { createId } from '../lib/ids'
import type { Card, CardPatch, ChecklistItem, ColumnId } from '../types'

export interface CardFormValues {
  title: string
  description: string
  priority: Card['priority']
  labelIds: string[]
  assigneeId: string | null
  dueDate: string | null
  checklist: ChecklistItem[]
  columnId: ColumnId
}

/** The card dialog's unsaved values: Save turns them into one action, so one Undo. */
export function useCardForm(initial: CardFormValues) {
  const [values, setValues] = useState(initial)
  const [showErrors, setShowErrors] = useState(false)

  const titleError =
    showErrors && values.title.trim() === ''
      ? 'Give the card a title.'
      : undefined

  function setField<K extends keyof CardFormValues>(
    key: K,
    value: CardFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  return {
    values,
    setField,
    titleError,

    addChecklistItem(text: string) {
      const trimmed = text.trim()
      if (!trimmed) return
      setField('checklist', [
        ...values.checklist,
        { id: createId('check'), text: trimmed, done: false },
      ])
    },
    updateChecklistItem(id: string, patch: Partial<ChecklistItem>) {
      setField(
        'checklist',
        values.checklist.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      )
    },
    removeChecklistItem(id: string) {
      setField(
        'checklist',
        values.checklist.filter((item) => item.id !== id),
      )
    },

    /** The values to save, or null when the form isn't valid yet (it then shows why). */
    submit(): (CardPatch & { title: string; columnId: ColumnId }) | null {
      setShowErrors(true)
      const title = values.title.trim()
      if (!title) return null
      return {
        title,
        description: values.description.trim(),
        priority: values.priority,
        labelIds: values.labelIds,
        assigneeId: values.assigneeId,
        dueDate: values.dueDate,
        checklist: values.checklist,
        columnId: values.columnId,
      }
    },
  }
}
