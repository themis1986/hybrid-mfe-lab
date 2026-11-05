// The fixed set of categories. The ids are the source for the schema's enum (and so for the types); each
// expense category owns one chart colour, so the spending chart and the badges agree. Icons live apart, in
// categoryIcons.ts, so this module and the schemas stay free of React.

export const EXPENSE_CATEGORY_IDS = [
  'housing',
  'groceries',
  'dining',
  'transport',
  'utilities',
  'health',
  'leisure',
  'other',
] as const

export const INCOME_CATEGORY_IDS = ['salary', 'freelance', 'other-income'] as const

export const CATEGORY_IDS = [
  ...EXPENSE_CATEGORY_IDS,
  ...INCOME_CATEGORY_IDS,
] as const

export type ExpenseCategoryId = (typeof EXPENSE_CATEGORY_IDS)[number]
export type IncomeCategoryId = (typeof INCOME_CATEGORY_IDS)[number]
export type CategoryId = (typeof CATEGORY_IDS)[number]

/** A chart palette token: the only colours charts and category marks use. */
export type ChartToken = `chart-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`

export interface CategoryInfo {
  label: string
  type: 'income' | 'expense'
  color: ChartToken
}

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  housing: { label: 'Housing', type: 'expense', color: 'chart-1' },
  groceries: { label: 'Groceries', type: 'expense', color: 'chart-2' },
  dining: { label: 'Dining out', type: 'expense', color: 'chart-3' },
  transport: { label: 'Transport', type: 'expense', color: 'chart-4' },
  utilities: { label: 'Utilities', type: 'expense', color: 'chart-5' },
  health: { label: 'Health', type: 'expense', color: 'chart-6' },
  leisure: { label: 'Leisure', type: 'expense', color: 'chart-7' },
  other: { label: 'Other', type: 'expense', color: 'chart-8' },
  salary: { label: 'Salary', type: 'income', color: 'chart-1' },
  freelance: { label: 'Freelance', type: 'income', color: 'chart-3' },
  'other-income': { label: 'Other income', type: 'income', color: 'chart-6' },
}

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES[id].label
}

export function isCategoryId(value: string): value is CategoryId {
  return Object.hasOwn(CATEGORIES, value)
}

export function isExpenseCategory(id: CategoryId): id is ExpenseCategoryId {
  return CATEGORIES[id].type === 'expense'
}

/**
 * The category a file or a person names: its id or its label, in any case ("Dining out", "dining"). Returns
 * the text unchanged when nothing matches, so the schema reports it.
 */
export function resolveCategory(text: string): string {
  const value = text.trim()
  const lower = value.toLowerCase()
  if (isCategoryId(lower)) return lower
  const match = CATEGORY_IDS.find(
    (id) => CATEGORIES[id].label.toLowerCase() === lower,
  )
  return match ?? value
}

/** The categories of one type, in their fixed order, as select options. */
export function categoryOptions(type: 'income' | 'expense') {
  const ids = type === 'income' ? INCOME_CATEGORY_IDS : EXPENSE_CATEGORY_IDS
  return ids.map((id) => ({ value: id, label: CATEGORIES[id].label }))
}
