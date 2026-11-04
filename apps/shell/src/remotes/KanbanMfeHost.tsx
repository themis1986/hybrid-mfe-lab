import { createRemoteHost } from './RemoteMfeHost'

export const KANBAN_BASE_PATH = '/kanban-app'

export const KanbanMfeHost = createRemoteHost(
  () => import('kanban/mount'),
  KANBAN_BASE_PATH,
  'Kanban board',
)
