import { Navigate, type RouteObject } from 'react-router'
import { RouteError } from './components/feedback/RouteError'
import { AppLayout } from './components/layout/AppLayout'
import { BudgetsPage } from './pages/BudgetsPage'
import { DashboardPage } from './pages/DashboardPage'
import { ImportExportPage } from './pages/ImportExportPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { PATHS } from './paths'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: DashboardPage },
      { path: PATHS.transactions, Component: TransactionsPage },
      { path: PATHS.budgets, Component: BudgetsPage },
      { path: PATHS.importExport, Component: ImportExportPage },
      { path: '*', element: <Navigate to={PATHS.dashboard} replace /> },
    ],
  },
]
