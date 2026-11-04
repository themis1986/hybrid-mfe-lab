import {
  TButton,
  TDialog,
  TDialogBody,
  TDialogClose,
  TDialogContent,
  TDialogDescription,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
  TField,
  TSpacer,
} from '@repo/ui'
import { type FormEvent, useState } from 'react'
import { useBoard } from '../../hooks/useBoard'
import { useBoardActions } from '../../hooks/useBoardActions'
import { useDialogs } from '../../hooks/useDialogs'
import type { Column } from '../../types'

function WipLimitForm({ column }: { column: Column }) {
  const { closeDialog } = useDialogs()
  const { setWipLimit } = useBoardActions()
  const [value, setValue] = useState(column.wipLimit?.toString() ?? '')
  const [error, setError] = useState<string>()

  function save(event: FormEvent) {
    event.preventDefault()
    const limit = Number(value)
    if (value.trim() !== '' && (!Number.isInteger(limit) || limit < 1)) {
      setError('Use a whole number of 1 or more, or leave it empty.')
      return
    }
    setWipLimit(column.id, value.trim() === '' ? null : limit)
    closeDialog()
  }

  return (
    // noValidate: the form shows its own message rather than the browser's bubble.
    <form noValidate onSubmit={save} className="contents">
      <TDialogHeader>
        <TDialogTitle>WIP limit for “{column.title}”</TDialogTitle>
        <TDialogDescription>
          Above the limit the column shows a warning. It never blocks a move.
        </TDialogDescription>
      </TDialogHeader>
      <TDialogBody>
        {/* The body scrolls, which clips whatever passes its edge: the padding keeps the focus ring whole. */}
        <div className="p-1">
          <TField
            label="Maximum cards"
            type="number"
            min={1}
            step={1}
            value={value}
            error={error}
            onChange={(event) => {
              setValue(event.target.value)
              setError(undefined)
            }}
          />
        </div>
      </TDialogBody>
      <TDialogFooter>
        {column.wipLimit !== null && (
          <TButton
            variant="ghost"
            label="Remove limit"
            onClick={() => {
              setWipLimit(column.id, null)
              closeDialog()
            }}
          />
        )}
        <TSpacer />
        <TDialogClose asChild>
          <TButton variant="ghost" label="Cancel" />
        </TDialogClose>
        <TButton type="submit" label="Save" />
      </TDialogFooter>
    </form>
  )
}

export function WipLimitDialog() {
  const board = useBoard()
  const { dialog, closeDialog } = useDialogs()
  const column =
    dialog?.kind === 'wip-limit' ? board.columns[dialog.columnId] : undefined

  return (
    <TDialog
      open={!!column}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <TDialogContent size="sm">
        {column && <WipLimitForm key={column.id} column={column} />}
      </TDialogContent>
    </TDialog>
  )
}
