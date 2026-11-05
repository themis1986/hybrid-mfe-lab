import {
  BookOpen,
  CloudSun,
  Coins,
  ListTodo,
  type LucideIcon,
  SquareKanban,
} from '@repo/ui/icons'
import { CRYPTO_BASE_PATH } from '../remotes/CryptoMfeHost'
import { KANBAN_BASE_PATH } from '../remotes/KanbanMfeHost'
import { TODO_BASE_PATH } from '../remotes/TodoMfeHost'
import { UI_REACT_DOCS_BASE_PATH } from '../remotes/UiReactDocsHost'
import { UI_VUE_DOCS_BASE_PATH } from '../remotes/UiVueDocsHost'
import { WEATHER_BASE_PATH } from '../remotes/WeatherMfeHost'
import { canAccess } from './access'
import type { User } from './users'

// The sidebar menu and the registry the access rules check. Every sub-application (a Vue or React
// microfrontend) gets an entry here, plus its route in App.tsx wrapped in <RequireApp>.
export type NavGroup = 'apps' | 'developer'
export const TECHS = ['vue', 'react'] as const
export type Tech = (typeof TECHS)[number]
export type AppId =
  'todo' | 'weather' | 'kanban' | 'crypto' | 'ui-react-docs' | 'ui-vue-docs'

export interface NavItem {
  id: AppId
  label: string
  to: string
  description: string
  icon: LucideIcon
  group: NavGroup
  tech: Tech
}

export const NAV_GROUPS: { id: NavGroup; label: string }[] = [
  { id: 'apps', label: 'Applications' },
  { id: 'developer', label: 'Developer' },
]

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'todo',
    label: 'Todo',
    to: TODO_BASE_PATH,
    description:
      'The todo microfrontend: a Vue 3 app loaded at runtime through Module Federation.',
    icon: ListTodo,
    group: 'apps',
    tech: 'vue',
  },
  {
    id: 'weather',
    label: 'Weather',
    to: WEATHER_BASE_PATH,
    description:
      'The weather microfrontend: a Vue 3 app with a clickable map and a live forecast.',
    icon: CloudSun,
    group: 'apps',
    tech: 'vue',
  },
  {
    id: 'kanban',
    label: 'Kanban board',
    to: KANBAN_BASE_PATH,
    description:
      'The kanban microfrontend: a React 19 board with drag and drop, filters and undo.',
    icon: SquareKanban,
    group: 'apps',
    tech: 'react',
  },
  {
    id: 'crypto',
    label: 'Crypto market',
    to: CRYPTO_BASE_PATH,
    description:
      'The crypto microfrontend: a Vue 3 market dashboard with live prices, charts and a watchlist.',
    icon: Coins,
    group: 'apps',
    tech: 'vue',
  },
  {
    id: 'ui-react-docs',
    label: 'React UI docs',
    to: UI_REACT_DOCS_BASE_PATH,
    description:
      'Every @repo/ui component, documented by a React microfrontend: examples, usage and props.',
    icon: BookOpen,
    group: 'developer',
    tech: 'react',
  },
  {
    id: 'ui-vue-docs',
    label: 'Vue UI docs',
    to: UI_VUE_DOCS_BASE_PATH,
    description:
      'Every @repo/ui-vue component, documented by a Vue microfrontend: examples, usage, props and slots.',
    icon: BookOpen,
    group: 'developer',
    tech: 'vue',
  },
]

/** The menu entries the user may open; none while signed out. */
export function getAccessibleItems(user: User | null): NavItem[] {
  return user ? NAV_ITEMS.filter((item) => canAccess(user.grants, item)) : []
}

/** Whether the user may open this URL path: a remote's path needs access to it, the shell's own pages don't. */
export function canOpenPath(user: User, pathname: string): boolean {
  const app = NAV_ITEMS.find(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  )
  return !app || canAccess(user.grants, app)
}
