import { createRemoteHost } from './RemoteMfeHost'

export const BUDGET_BASE_PATH = '/budget-app'

export const BudgetMfeHost = createRemoteHost(
  () => import('budget/mount'),
  BUDGET_BASE_PATH,
  'Budget',
)
