import { TButton, TIcon } from '@repo/ui'
import { FileSpreadsheet, Plus, Wallet } from '@repo/ui/icons'
import { Link } from 'react-router'
import { useDialogs } from '../../hooks/useDialogs'
import { PATHS } from '../../paths'
import { Message } from './Message'

/** What a page shows when there are no transactions at all: the two ways to get some. */
export function EmptyLedger() {
  const { openDialog } = useDialogs()
  return (
    <Message
      icon={Wallet}
      title="Add your first transaction"
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <TButton onClick={() => openDialog({ kind: 'transaction', mode: 'new' })}>
            <TIcon icon={Plus} size="sm" />
            Add a transaction
          </TButton>
          <TButton variant="outline" asChild>
            <Link to={PATHS.importExport}>
              <TIcon icon={FileSpreadsheet} size="sm" />
              Import a CSV
            </Link>
          </TButton>
        </div>
      }
    >
      Record income and spending as it happens, or bring in a CSV file you exported before. The dashboard
      and budgets fill in from there.
    </Message>
  )
}
