import { TButton, TPageHeader } from '@repo/ui'
import { CircleAlert } from '@repo/ui/icons'
import { useRef } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useDialogs } from '../../hooks/useDialogs'
import { useHistory } from '../../hooks/useHistory'
import { useLedgerStatus } from '../../hooks/useLedgerStatus'
import { useShortcuts } from '../../hooks/useShortcuts'
import { useUndoToast } from '../../hooks/useUndoToast'
import { PATHS } from '../../paths'
import { Message } from '../feedback/Message'
import { PageSkeleton } from '../feedback/PageSkeleton'
import { DialogHost } from './DialogHost'
import { HeaderActions } from './HeaderActions'
import { MainNav } from './MainNav'

/** The search field's id, so the "/" shortcut can reach it from any page. */
export const SEARCH_INPUT_ID = 'budget-search'

function Content({
  status,
  error,
  retry,
}: ReturnType<typeof useLedgerStatus>) {
  if (status === 'error') {
    return (
      <Message
        icon={CircleAlert}
        tone="danger"
        title="The budget data didn't load"
        action={<TButton variant="outline" label="Try again" onClick={retry} />}
      >
        {error}
      </Message>
    )
  }
  if (status === 'loading') return <PageSkeleton />
  return <Outlet />
}

// The frame every page renders in: the header with the app-wide actions, the page links, the page, and the
// dialogs any page can open.
export function AppLayout() {
  const rootRef = useRef<HTMLDivElement>(null)
  const ledger = useLedgerStatus()
  const ready = ledger.status === 'ready'
  const { dialog, openDialog, closeDialog } = useDialogs()
  const { undo, redo } = useHistory()
  const navigate = useNavigate()

  useUndoToast()
  useShortcuts(rootRef, {
    newTransaction: () => {
      if (ready) openDialog({ kind: 'transaction', mode: 'new' })
    },
    focusSearch: () => {
      const search = document.getElementById(SEARCH_INPUT_ID)
      if (search) search.focus()
      else void navigate(PATHS.transactions, { state: { focusSearch: true } })
    },
    toggleHelp: () => {
      if (dialog?.kind === 'shortcuts') closeDialog()
      else openDialog({ kind: 'shortcuts' })
    },
    undo,
    redo,
  })

  return (
    <div ref={rootRef} className="flex flex-col gap-4 p-4 font-sans text-fg">
      <TPageHeader
        title="Budget"
        description="Track income and spending, and stay within your budgets."
        actions={<HeaderActions ready={ready} />}
      />
      <MainNav />
      {/* A div, not <main>: inside the shell the page already has its main landmark. */}
      <div className="min-w-0">
        <Content {...ledger} />
      </div>
      {ready && <DialogHost />}
    </div>
  )
}
