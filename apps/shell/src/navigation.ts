import { TODO_BASE_PATH } from './TodoMfeHost'

// The sidebar menu. Every sub-application (a Vue or React microfrontend) gets an entry here, plus its
// route in App.tsx.
export type NavGroup = 'apps' | 'developer'
export type Tech = 'vue' | 'react'

export interface NavItem {
  label: string
  to: string
  description: string
  group: NavGroup
  tech: Tech
}

export const UI_DOCS_PATH = '/ui-docs'

export const NAV_GROUPS: { id: NavGroup; label: string }[] = [
  { id: 'apps', label: 'Applications' },
  { id: 'developer', label: 'Developer' },
]

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Todo app',
    to: TODO_BASE_PATH,
    description: 'The todo microfrontend: a Vue 3 app loaded at runtime through Module Federation.',
    group: 'apps',
    tech: 'vue',
  },
  {
    label: 'React UI docs',
    to: UI_DOCS_PATH,
    description: 'Every @repo/ui component with a live example, its usage and its props.',
    group: 'developer',
    tech: 'react',
  },
]
