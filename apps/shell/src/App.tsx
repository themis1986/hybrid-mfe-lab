import { TAppShell, TAppShellHeader, TAppShellMain, TAppShellSidebar, TContainer, TSpacer } from '@repo/ui'
import { Route, Routes } from 'react-router'
import { HomePage } from './HomePage'
import { Logo } from './Logo'
import { UI_DOCS_PATH } from './navigation'
import { Sidebar } from './Sidebar'
import { TODO_BASE_PATH, TodoMfeHost } from './TodoMfeHost'
import { UI_VUE_DOCS_BASE_PATH, UiVueDocsHost } from './UiVueDocsHost'
import { UiDocsPage } from './ui-docs/UiDocsPage'

export function App() {
  return (
    <TAppShell viewport>
      <TAppShellHeader>
        <Logo />
        <TSpacer />
        <span className="text-sm text-fg-muted max-sm:hidden">Microfrontends playground</span>
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
          <Route path={UI_DOCS_PATH} element={<UiDocsPage />} />
          {/* The Vue docs microfrontend lays out its own page. */}
          <Route path={`${UI_VUE_DOCS_BASE_PATH}/*`} element={<UiVueDocsHost />} />
        </Routes>
      </TAppShellMain>
    </TAppShell>
  )
}
