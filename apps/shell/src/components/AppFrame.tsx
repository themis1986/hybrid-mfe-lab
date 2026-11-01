import {
  TAppShell,
  TAppShellHeader,
  TAppShellMain,
  TAppShellSidebar,
  TSpacer,
} from '@repo/ui'
import { Outlet } from 'react-router'
import { GithubLink } from './GithubLink'
import { Logo } from './Logo'
import { Sidebar } from './Sidebar'
import { ThemeSwitch } from './ThemeSwitch'
import { UserMenu } from './UserMenu'

// The page frame around every signed-in route: header, menu, and the matched route in the main area.
export function AppFrame() {
  return (
    <TAppShell viewport>
      <TAppShellHeader>
        <Logo />
        <TSpacer />
        <span className="text-sm text-fg-muted max-sm:hidden">
          Microfrontends playground
        </span>
        <ThemeSwitch />
        <GithubLink />
        <UserMenu />
      </TAppShellHeader>
      <TAppShellSidebar>
        <Sidebar />
      </TAppShellSidebar>
      <TAppShellMain>
        <Outlet />
      </TAppShellMain>
    </TAppShell>
  )
}
