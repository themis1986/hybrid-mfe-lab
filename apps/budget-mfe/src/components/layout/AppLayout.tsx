import { TButton, TPageHeader, TSkeleton } from '@repo/ui'
import { CircleAlert } from '@repo/ui/icons'
import { Outlet } from 'react-router'
import { useLedgerStatus } from '../../hooks/useLedgerStatus'
import { Message } from '../feedback/Message'
import { MainNav } from './MainNav'

function Content() {
  const { status, error, retry } = useLedgerStatus()
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
  if (status === 'loading') {
    // The skeleton is decorative; the status text is what assistive technology announces.
    return (
      <div role="status">
        <span className="sr-only">Loading the budget data</span>
        <TSkeleton shape="block" className="h-64" />
      </div>
    )
  }
  return <Outlet />
}

// The frame every page renders in: the header with the app-wide actions, the page links, then the page.
export function AppLayout() {
  return (
    <div className="flex flex-col gap-4 p-4 font-sans text-fg">
      <TPageHeader
        title="Budget"
        description="Track income and spending, and stay within your budgets."
      />
      <MainNav />
      {/* A div, not <main>: inside the shell the page already has its main landmark. */}
      <div className="min-w-0">
        <Content />
      </div>
    </div>
  )
}
