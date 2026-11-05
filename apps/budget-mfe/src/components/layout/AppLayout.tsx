import { TPageHeader } from '@repo/ui'
import { Outlet } from 'react-router'
import { MainNav } from './MainNav'

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
        <Outlet />
      </div>
    </div>
  )
}
