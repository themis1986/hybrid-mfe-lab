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
  TRadioGroup,
  TRadioGroupItem,
  TSelect,
} from '@repo/ui'
import { useId, useState } from 'react'
import { useBoard } from '../../hooks/useBoard'
import { useBoardActions } from '../../hooks/useBoardActions'
import { useDialogs } from '../../hooks/useDialogs'
import type { Column } from '../../types'

function DeleteColumnForm({ column }: { column: Column }) {
  const id = useId()
  const board = useBoard()
  const { closeDialog } = useDialogs()
  const { deleteColumn } = useBoardActions()
  const others = board.columnIds.filter((other) => other !== column.id)
  const count = column.cardIds.length

  // Moving the cards keeps the work, so it's the first choice whenever there's somewhere to move them.
  const [choice, setChoice] = useState<'move' | 'delete'>(
    others.length > 0 ? 'move' : 'delete',
  )
  const [target, setTarget] = useState(others[0] ?? '')

  return (
    <>
      <TDialogHeader>
        <TDialogTitle>Delete column “{column.title}”?</TDialogTitle>
        <TDialogDescription>
          {count === 0
            ? 'The column has no cards.'
            : `The column has ${count} card${count === 1 ? '' : 's'}. You can undo this.`}
        </TDialogDescription>
      </TDialogHeader>
      {count > 0 && others.length > 0 && (
        <TDialogBody>
          {/* The body scrolls, which clips whatever passes its edge: the padding keeps the focus rings whole. */}
          <div className="p-1">
            <TRadioGroup
              aria-label="What happens to its cards"
              value={choice}
              onValueChange={(value) => setChoice(value as 'move' | 'delete')}
            >
              <div className="flex items-center gap-2">
                <TRadioGroupItem id={`${id}-move`} value="move" />
                <label htmlFor={`${id}-move`} className="text-sm text-fg">
                  Move its cards to another column
                </label>
              </div>
              {choice === 'move' && (
                <div className="ps-6">
                  <TSelect
                    aria-label="Column to move the cards to"
                    options={others.map((other) => ({
                      value: other,
                      label: board.columns[other]!.title,
                    }))}
                    value={target}
                    onValueChange={setTarget}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <TRadioGroupItem id={`${id}-delete`} value="delete" />
                <label htmlFor={`${id}-delete`} className="text-sm text-fg">
                  Delete its cards too
                </label>
              </div>
            </TRadioGroup>
          </div>
        </TDialogBody>
      )}
      <TDialogFooter>
        <TDialogClose asChild>
          <TButton variant="ghost" label="Cancel" />
        </TDialogClose>
        <TButton
          variant="danger"
          label="Delete column"
          onClick={() => {
            deleteColumn(column.id, choice === 'move' ? target || null : null)
            closeDialog()
          }}
        />
      </TDialogFooter>
    </>
  )
}

export function DeleteColumnDialog() {
  const board = useBoard()
  const { dialog, closeDialog } = useDialogs()
  const column =
    dialog?.kind === 'delete-column'
      ? board.columns[dialog.columnId]
      : undefined

  return (
    <TDialog
      open={!!column}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <TDialogContent size="sm" role="alertdialog" hideClose>
        {column && <DeleteColumnForm key={column.id} column={column} />}
      </TDialogContent>
    </TDialog>
  )
}
