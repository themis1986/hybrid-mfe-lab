import { TAlarmHost, TContainer } from '@repo/ui'
import { Route, Routes } from 'react-router'
import { AppFrame } from './components/AppFrame'
import { RequireApp } from './components/RequireApp'
import { RequireAuth } from './components/RequireAuth'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { CRYPTO_BASE_PATH, CryptoMfeHost } from './remotes/CryptoMfeHost'
import { KANBAN_BASE_PATH, KanbanMfeHost } from './remotes/KanbanMfeHost'
import { TODO_BASE_PATH, TodoMfeHost } from './remotes/TodoMfeHost'
import {
  UI_REACT_DOCS_BASE_PATH,
  UiReactDocsHost,
} from './remotes/UiReactDocsHost'
import { UI_VUE_DOCS_BASE_PATH, UiVueDocsHost } from './remotes/UiVueDocsHost'
import { WEATHER_BASE_PATH, WeatherMfeHost } from './remotes/WeatherMfeHost'

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Everything else needs a signed-in user; each remote also needs the user's access to it. */}
        <Route
          element={
            <RequireAuth>
              <AppFrame />
            </RequireAuth>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route
            path={`${TODO_BASE_PATH}/*`}
            element={
              <RequireApp id="todo">
                <TContainer className="py-6">
                  <TodoMfeHost />
                </TContainer>
              </RequireApp>
            }
          />
          {/* The weather, kanban, crypto and docs microfrontends lay out their own pages. */}
          <Route
            path={`${WEATHER_BASE_PATH}/*`}
            element={
              <RequireApp id="weather">
                <WeatherMfeHost />
              </RequireApp>
            }
          />
          <Route
            path={`${KANBAN_BASE_PATH}/*`}
            element={
              <RequireApp id="kanban">
                <KanbanMfeHost />
              </RequireApp>
            }
          />
          <Route
            path={`${CRYPTO_BASE_PATH}/*`}
            element={
              <RequireApp id="crypto">
                <CryptoMfeHost />
              </RequireApp>
            }
          />
          <Route
            path={`${UI_REACT_DOCS_BASE_PATH}/*`}
            element={
              <RequireApp id="ui-react-docs">
                <UiReactDocsHost />
              </RequireApp>
            }
          />
          <Route
            path={`${UI_VUE_DOCS_BASE_PATH}/*`}
            element={
              <RequireApp id="ui-vue-docs">
                <UiVueDocsHost />
              </RequireApp>
            }
          />
        </Route>
      </Routes>
      {/* The page's alarm host: mounted first, it also shows the alarms the microfrontends raise. */}
      <TAlarmHost />
    </>
  )
}
