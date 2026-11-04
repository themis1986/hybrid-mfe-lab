import { TButton, TIcon, TInput } from '@repo/ui'
import { Plus } from '@repo/ui/icons'
import { useState } from 'react'
import { useBoardActions } from '../../hooks/useBoardActions'

export function AddColumn() {
  const { createColumn } = useBoardActions()
  const [title, setTitle] = useState<string | null>(null)

  return (
    <div className="box-border w-72 shrink-0 snap-start">
      {title === null ? (
        <TButton
          variant="outline"
          className="w-full justify-start border-dashed text-fg-muted"
          onClick={() => setTitle('')}
        >
          <TIcon icon={Plus} size="sm" />
          Add column
        </TButton>
      ) : (
        <TInput
          autoFocus
          value={title}
          placeholder="Column name, then Enter"
          aria-label="New column name"
          onChange={(event) => setTitle(event.target.value)}
          onBlur={() => setTitle(null)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setTitle(null)
            if (event.key === 'Enter') {
              const trimmed = title.trim()
              if (trimmed) createColumn(trimmed)
              setTitle(null)
            }
          }}
        />
      )}
    </div>
  )
}
