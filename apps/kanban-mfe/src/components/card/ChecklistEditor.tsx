import { TCheckbox, TInput, TProgress } from '@repo/ui'
import { Plus, Trash2 } from '@repo/ui/icons'
import { useState } from 'react'
import type { ChecklistItem } from '../../types'
import { IconButton } from '../common/IconButton'

export function ChecklistEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: ChecklistItem[]
  onAdd(text: string): void
  onUpdate(id: string, patch: Partial<ChecklistItem>): void
  onRemove(id: string): void
}) {
  const [text, setText] = useState('')
  const done = items.filter((item) => item.done).length
  const percent =
    items.length === 0 ? 0 : Math.round((done / items.length) * 100)

  function add() {
    onAdd(text)
    setText('')
  }

  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
      <legend className="p-0 text-sm font-medium text-fg">Checklist</legend>
      {items.length > 0 && (
        <div className="flex items-center gap-2">
          <TProgress
            size="sm"
            tone={done === items.length ? 'success' : 'accent'}
            value={percent}
            aria-label="Checklist progress"
            className="min-w-0 flex-1"
          />
          <span className="text-xs text-fg-muted">
            {done} of {items.length}
          </span>
        </div>
      )}
      {items.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <TCheckbox
                checked={item.done}
                aria-label={`Done: ${item.text}`}
                onCheckedChange={(checked) =>
                  onUpdate(item.id, { done: checked === true })
                }
              />
              <TInput
                size="sm"
                value={item.text}
                aria-label="Checklist item"
                className="min-w-0 flex-1"
                onChange={(event) =>
                  onUpdate(item.id, { text: event.target.value })
                }
              />
              <IconButton
                icon={Trash2}
                label={`Remove ${item.text}`}
                onClick={() => onRemove(item.id)}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2">
        <TInput
          size="sm"
          value={text}
          placeholder="Add an item"
          aria-label="New checklist item"
          className="min-w-0 flex-1"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Enter here adds an item; it must not submit the card's form.
              event.preventDefault()
              add()
            }
          }}
        />
        <IconButton icon={Plus} label="Add item" onClick={add} />
      </div>
    </fieldset>
  )
}
