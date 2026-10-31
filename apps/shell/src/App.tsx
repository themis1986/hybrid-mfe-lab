import { TAppShell, TAppShellHeader, TAppShellMain, TAppShellSidebar, TContainer, TSpacer } from '@repo/ui'
import { Route, Routes } from 'react-router'
import { HomePage } from './HomePage'
import { Logo } from './Logo'
import { Sidebar } from './Sidebar'
import { ThemeSwitch } from './ThemeSwitch'
import { TODO_BASE_PATH, TodoMfeHost } from './TodoMfeHost'
import { UI_REACT_DOCS_BASE_PATH, UiReactDocsHost } from './UiReactDocsHost'
import { UI_VUE_DOCS_BASE_PATH, UiVueDocsHost } from './UiVueDocsHost'

export function App() {
  return (
    <TAppShell viewport>
      <TAppShellHeader>
        <Logo />
        <TSpacer />
        <span className="text-sm text-fg-muted max-sm:hidden">Microfrontends playground</span>
        <ThemeSwitch />
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
  )
}
