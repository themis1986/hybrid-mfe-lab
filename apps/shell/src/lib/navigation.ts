import { TODO_BASE_PATH } from '../remotes/TodoMfeHost'
import { UI_REACT_DOCS_BASE_PATH } from '../remotes/UiReactDocsHost'
import { UI_VUE_DOCS_BASE_PATH } from '../remotes/UiVueDocsHost'
import { canAccess } from './access'
import type { User } from './users'

// The sidebar menu and the registry the access rules check. Every sub-application (a Vue or React
// microfrontend) gets an entry here, plus its route in App.tsx wrapped in <RequireApp>.
export type NavGroup = 'apps' | 'developer'
export const TECHS = ['vue', 'react'] as const
export type Tech = (typeof TECHS)[number]
export type AppId = 'todo' | 'ui-react-docs' | 'ui-vue-docs'

export interface NavItem {
  id: AppId
  label: string
  to: string
  description: string
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
    label: 'Todo app',
    to: TODO_BASE_PATH,
    description:
      'The todo microfrontend: a Vue 3 app loaded at runtime through Module Federation.',
    group: 'apps',
    tech: 'vue',
  },
  {
    id: 'ui-react-docs',
    label: 'React UI docs',
    to: UI_REACT_DOCS_BASE_PATH,
    description:
      'Every @repo/ui component, documented by a React microfrontend: examples, usage and props.',
    group: 'developer',
    tech: 'react',
  },
  {
    id: 'ui-vue-docs',
    label: 'Vue UI docs',
    to: UI_VUE_DOCS_BASE_PATH,
    description:
      'Every @repo/ui-vue component, documented by a Vue microfrontend: examples, usage, props and slots.',
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
