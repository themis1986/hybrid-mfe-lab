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
import {
  useTransaction,
  useTransactionActions,
} from '../../hooks/useTransactions'
import { formatDate } from '../../lib/dates'
import { formatMoney } from '../../lib/money'

/** Asks before deleting one or several transactions. The delete is one undo step, offered in a toast. */
export function DeleteTransactionsDialog() {
  const { dialog, closeDialog } = useDialogs()
  const { remove } = useTransactionActions()
  const ids = dialog?.kind === 'confirm-delete' ? dialog.ids : null
  const single = useTransaction(ids?.length === 1 ? ids[0]! : null)

  return (
    <TDialog
      open={!!ids}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <TDialogContent size="sm" role="alertdialog" hideClose>
        {ids && (
          <>
            <TDialogHeader>
              <TDialogTitle>
                {ids.length === 1
                  ? 'Delete this transaction?'
                  : `Delete ${ids.length} transactions?`}
              </TDialogTitle>
              <TDialogDescription>
                {single
                  ? `“${single.description}”, ${formatMoney(single.amount)} on ${formatDate(single.date)}. You can undo this.`
                  : 'You can undo this.'}
              </TDialogDescription>
            </TDialogHeader>
            <TDialogFooter>
              <TDialogClose asChild>
                <TButton variant="ghost" label="Cancel" />
              </TDialogClose>
              <TButton
                variant="danger"
                label="Delete"
                onClick={() => {
                  remove(ids)
                  closeDialog()
                }}
              />
            </TDialogFooter>
          </>
        )}
      </TDialogContent>
    </TDialog>
  )
}
