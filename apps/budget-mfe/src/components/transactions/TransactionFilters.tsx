import { TButton, TCombobox, TInput, TSelect } from '@repo/ui'
import { useFilters } from '../../hooks/useFilters'
import { CATEGORY_IDS, categoryLabel } from '../../lib/categories'
import type { TransactionFilters as Filters } from '../../lib/filter'
import type { CategoryId } from '../../types'
import { SEARCH_INPUT_ID } from '../layout/AppLayout'

const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
]

const CATEGORY_OPTIONS = CATEGORY_IDS.map((id) => ({
  value: id,
  label: categoryLabel(id),
}))

/** Search, type and categories: app state, so the export of the current view writes exactly these rows. */
export function TransactionFilters() {
  const { filters, active, setQuery, setType, setCategories, clear } =
    useFilters()

  return (
    <>
      <TInput
        id={SEARCH_INPUT_ID}
        type="search"
        size="sm"
        aria-label="Search transactions"
        placeholder="Search…  ( / )"
        className="w-full max-w-60"
        value={filters.query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <TSelect
        size="sm"
        aria-label="Type"
        className="w-36"
        options={TYPE_OPTIONS}
        value={filters.type}
        onValueChange={(value) => setType(value as Filters['type'])}
      />
      <TCombobox
        multiple
        size="sm"
        aria-label="Categories"
        placeholder="All categories"
        removeLabel="Remove"
        className="w-full max-w-72"
        options={CATEGORY_OPTIONS}
        value={filters.categories}
        onValueChange={(value) => setCategories(value as CategoryId[])}
      />
      {active && <TButton variant="ghost" size="sm" label="Clear filters" onClick={clear} />}
    </>
  )
}
