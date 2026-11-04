import { TButton, TIcon, TInput } from '@repo/ui'
import { Plus } from '@repo/ui/icons'
import { useState } from 'react'
import { useBoardActions } from '../../hooks/useBoardActions'
import type { ColumnId } from '../../types'

// Adds cards by title, one after another: Enter adds and stays open, Escape or leaving the field closes it.
export function QuickAddCard({ columnId }: { columnId: ColumnId }) {
  const { createCard } = useBoardActions()
  const [title, setTitle] = useState<string | null>(null)

  if (title === null) {
    return (
      <TButton
        variant="ghost"
        size="sm"
        className="justify-start text-fg-muted"
        onClick={() => setTitle('')}
      >
        <TIcon icon={Plus} size="sm" />
        Add card
      </TButton>
    )
  }

  return (
    <TInput
      autoFocus
      size="sm"
      value={title}
      placeholder="Card title, then Enter"
      aria-label="New card title"
      onChange={(event) => setTitle(event.target.value)}
      onBlur={() => setTitle(null)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setTitle(null)
        if (event.key === 'Enter') {
          const trimmed = title.trim()
          if (trimmed) createCard(columnId, { title: trimmed })
          setTitle('')
        }
      }}
    />
  )
}
