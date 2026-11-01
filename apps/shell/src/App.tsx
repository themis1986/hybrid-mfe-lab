import { TAlarmHost, TAppShell, TAppShellHeader, TAppShellMain, TAppShellSidebar, TContainer, TSpacer } from '@repo/ui'
import { Route, Routes } from 'react-router'
import { GithubLink } from './components/GithubLink'
import { Logo } from './components/Logo'
import { Sidebar } from './components/Sidebar'
import { ThemeSwitch } from './components/ThemeSwitch'
import { HomePage } from './pages/HomePage'
import { TODO_BASE_PATH, TodoMfeHost } from './remotes/TodoMfeHost'
import { UI_REACT_DOCS_BASE_PATH, UiReactDocsHost } from './remotes/UiReactDocsHost'
import { UI_VUE_DOCS_BASE_PATH, UiVueDocsHost } from './remotes/UiVueDocsHost'

export function App() {
  return (
    <>
      <TAppShell viewport>
        <TAppShellHeader>
          <Logo />
          <TSpacer />
          <span className="text-sm text-fg-muted max-sm:hidden">Microfrontends playground</span>
          <ThemeSwitch />
          <GithubLink />
        </TAppShellHeader>
        <TAppShellSidebar>
          <Sidebar />
        </TAppShellSidebar>
        <TAppShellMain>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path={`${TODO_BASE_PATH}/*`}
              element={
                <TContainer className="py-6">
                  <TodoMfeHost />
                </TContainer>
              }
            />
            {/* The docs microfrontends lay out their own pages. */}
            <Route path={`${UI_REACT_DOCS_BASE_PATH}/*`} element={<UiReactDocsHost />} />
            <Route path={`${UI_VUE_DOCS_BASE_PATH}/*`} element={<UiVueDocsHost />} />
          </Routes>
        </TAppShellMain>
      </TAppShell>
      {/* The page's alarm host: mounted first, it also shows the alarms the microfrontends raise. */}
      <TAlarmHost />
    </>
  )
}
