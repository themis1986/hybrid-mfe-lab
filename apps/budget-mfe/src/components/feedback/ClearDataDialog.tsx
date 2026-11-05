import {
  TButton,
  TDialog,
  TDialogClose,
  TDialogContent,
  TDialogDescription,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
} from '@repo/ui'
import { useDialogs } from '../../hooks/useDialogs'
import { useTransactionActions } from '../../hooks/useTransactions'

/** Asks before removing every transaction and budget, which is one undo step. */
export function ClearDataDialog() {
  const { dialog, closeDialog } = useDialogs()
  const { clearAll } = useTransactionActions()

  return (
    <TDialog
      open={dialog?.kind === 'confirm-clear'}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <TDialogContent size="sm" role="alertdialog" hideClose>
        <TDialogHeader>
          <TDialogTitle>Clear all data?</TDialogTitle>
          <TDialogDescription>
            This removes every transaction and budget. You can undo it, and
            an exported CSV file brings the transactions back.
          </TDialogDescription>
        </TDialogHeader>
        <TDialogFooter>
          <TDialogClose asChild>
            <TButton variant="ghost" label="Cancel" />
          </TDialogClose>
          <TButton
            variant="danger"
            label="Clear data"
            onClick={() => {
              clearAll()
              closeDialog()
            }}
          />
        </TDialogFooter>
      </TDialogContent>
    </TDialog>
  )
}
