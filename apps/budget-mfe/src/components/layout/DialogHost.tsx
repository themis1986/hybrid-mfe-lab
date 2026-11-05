import { BudgetDialog } from '../budgets/BudgetDialog'
import { ClearDataDialog } from '../feedback/ClearDataDialog'
import { ShortcutsDialog } from '../feedback/ShortcutsDialog'
import { DeleteTransactionsDialog } from '../transactions/DeleteTransactionsDialog'
import { TransactionDialog } from '../transactions/TransactionDialog'

/** Every app-wide dialog. Each one opens when the ui state names it, so any page can open any of them. */
export function DialogHost() {
  return (
    <>
      <TransactionDialog />
      <DeleteTransactionsDialog />
      <BudgetDialog />
      <ClearDataDialog />
      <ShortcutsDialog />
    </>
  )
}
