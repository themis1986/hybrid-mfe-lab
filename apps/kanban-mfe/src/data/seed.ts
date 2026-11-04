import { addDays } from '../lib/dates'
import type {
  Board,
  Card,
  ChecklistItem,
  Column,
  Label,
  Member,
} from '../types'

const LABELS: Label[] = [
  { id: 'label-bug', name: 'Bug', tone: 'danger' },
  { id: 'label-feature', name: 'Feature', tone: 'accent' },
  { id: 'label-design', name: 'Design', tone: 'info' },
  { id: 'label-tech-debt', name: 'Tech debt', tone: 'warning' },
  { id: 'label-docs', name: 'Docs', tone: 'success' },
  { id: 'label-research', name: 'Research', tone: 'neutral' },
]

const MEMBERS: Member[] = [
  { id: 'member-amara', name: 'Amara Okafor' },
  { id: 'member-diego', name: 'Diego Ramos' },
  { id: 'member-ingrid', name: 'Ingrid Larsen' },
  { id: 'member-kenji', name: 'Kenji Sato' },
  { id: 'member-sofia', name: 'Sofia Rossi' },
]

function checklist(id: string, items: [string, boolean][]): ChecklistItem[] {
  return items.map(([text, done], index) => ({
    id: `${id}-check-${index}`,
    text,
    done,
  }))
}

function byId<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]))
}

// Sample content, with dates relative to today so the board always shows a realistic mix of overdue,
// due-soon and later cards.
export function createSeedBoard(now: string): Board {
  const day = (offset: number) => addDays(now, offset)

  const card = (
    id: string,
    title: string,
    fields: Partial<Omit<Card, 'id' | 'title'>> = {},
  ): Card => ({
    id,
    title,
    description: '',
    priority: 'none',
    labelIds: [],
    assigneeId: null,
    dueDate: null,
    checklist: [],
    createdAt: `${day(-14)}T09:00:00.000Z`,
    ...fields,
  })

  const cards: Card[] = [
    card('card-sso', 'Add single sign-on for workspace admins', {
      description:
        'Admins have asked for SAML sign-in. Start with one provider and keep password sign-in as the fallback.',
      priority: 'high',
      labelIds: ['label-feature'],
      assigneeId: 'member-kenji',
      dueDate: day(9),
      checklist: checklist('card-sso', [
        ['Compare the provider libraries', true],
        ['Write the rollout plan', false],
        ['Agree the fallback with support', false],
      ]),
    }),
    card('card-export', 'CSV export for the invoices table', {
      description:
        'Finance exports by hand every month. Respect the active filters.',
      priority: 'medium',
      labelIds: ['label-feature'],
      assigneeId: 'member-sofia',
      dueDate: day(14),
    }),
    card('card-onboarding', 'Research why trial users drop off in week one', {
      description:
        'Five interviews plus the funnel data. Summarise the top three causes.',
      priority: 'medium',
      labelIds: ['label-research'],
      assigneeId: 'member-ingrid',
      dueDate: day(6),
    }),
    card('card-deps', 'Replace the deprecated date library', {
      priority: 'low',
      labelIds: ['label-tech-debt'],
    }),
    card('card-changelog', 'Publish the public changelog page', {
      priority: 'low',
      labelIds: ['label-docs'],
      assigneeId: 'member-amara',
    }),
    card('card-webhook', 'Webhook retries stop after the first failure', {
      description:
        'Failed deliveries should back off and retry for 24 hours. Customers are missing events after short outages.',
      priority: 'urgent',
      labelIds: ['label-bug'],
      assigneeId: 'member-diego',
      dueDate: day(-2),
      checklist: checklist('card-webhook', [
        ['Reproduce with a failing endpoint', true],
        ['Add exponential backoff', true],
        ['Surface failures on the delivery log', false],
        ['Backfill the events missed this week', false],
      ]),
    }),
    card('card-search', 'Search results page redesign', {
      description: 'Group results by type and show why each one matched.',
      priority: 'high',
      labelIds: ['label-design', 'label-feature'],
      assigneeId: 'member-ingrid',
      dueDate: day(1),
      checklist: checklist('card-search', [
        ['Wireframes', true],
        ['Review with two customers', true],
        ['Final mockups', false],
      ]),
    }),
    card('card-queries', 'Slow dashboard query on large accounts', {
      priority: 'high',
      labelIds: ['label-bug', 'label-tech-debt'],
      assigneeId: 'member-kenji',
      dueDate: day(3),
    }),
    card('card-a11y', 'Fix keyboard traps in the settings dialogs', {
      description:
        'Focus escapes behind the dialog on two pages. Found in the accessibility audit.',
      priority: 'high',
      labelIds: ['label-bug'],
      assigneeId: 'member-sofia',
      dueDate: day(0),
      checklist: checklist('card-a11y', [
        ['Billing dialog', true],
        ['Team invite dialog', false],
      ]),
    }),
    card('card-api-docs', 'Document the new pagination parameters', {
      priority: 'medium',
      labelIds: ['label-docs'],
      assigneeId: 'member-amara',
      dueDate: day(2),
    }),
    card('card-rate-limit', 'Per-token rate limits on the public API', {
      priority: 'medium',
      labelIds: ['label-feature'],
      assigneeId: 'member-diego',
      dueDate: day(-1),
    }),
    card('card-dark', 'Dark theme for the email preview', {
      priority: 'low',
      labelIds: ['label-design'],
      assigneeId: 'member-ingrid',
      dueDate: day(-6),
    }),
    card('card-audit', 'Audit log for permission changes', {
      priority: 'medium',
      labelIds: ['label-feature'],
      assigneeId: 'member-kenji',
      dueDate: day(-4),
      checklist: checklist('card-audit', [
        ['Record the events', true],
        ['Add the admin page', true],
      ]),
    }),
    card('card-ci', 'Cut the CI pipeline below ten minutes', {
      priority: 'low',
      labelIds: ['label-tech-debt'],
      assigneeId: 'member-diego',
    }),
  ]

  const column = (
    id: string,
    title: string,
    cardIds: string[],
    wipLimit: number | null = null,
  ): Column => ({ id, title, cardIds, wipLimit })

  const columns: Column[] = [
    column('column-todo', 'To do', [
      'card-sso',
      'card-export',
      'card-onboarding',
      'card-deps',
      'card-changelog',
    ]),
    column(
      'column-progress',
      'In progress',
      ['card-webhook', 'card-search', 'card-queries', 'card-a11y'],
      3,
    ),
    column('column-review', 'Review', ['card-api-docs', 'card-rate-limit'], 4),
    column('column-done', 'Done', ['card-dark', 'card-audit', 'card-ci']),
  ]

  return {
    id: 'board-product',
    title: 'Product roadmap',
    columnIds: columns.map(({ id }) => id),
    columns: byId(columns),
    cards: byId(cards),
    labels: byId(LABELS),
    members: byId(MEMBERS),
  }
}
