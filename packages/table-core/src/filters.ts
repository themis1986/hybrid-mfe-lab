import type { TableLabels } from './labels'
import { formatTableDate, formatTableNumber } from './format'
import type {
  TableColumn,
  TableColumnFilter,
  TableDateRange,
  TableNumberRange,
  TableOption,
} from './types'

type FilterType = TableColumnFilter<unknown>['type']

/** Whether a filter value filters anything. An empty one is removed from the state. */
export function isTableFilterEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') {
    return Object.values(value as object).every(
      (part) => part === undefined || part === null || part === '',
    )
  }
  return false
}

export function matchesTextFilter(value: unknown, filter: unknown): boolean {
  if (value === null || value === undefined) return false
  return String(value)
    .toLowerCase()
    .includes(String(filter ?? '').toLowerCase())
}

export function matchesNumberRange(
  value: unknown,
  { min, max }: TableNumberRange,
): boolean {
  const number = typeof value === 'number' ? value : Number(value)
  if (value === null || value === undefined || Number.isNaN(number))
    return false
  return (
    (min === undefined || number >= min) && (max === undefined || number <= max)
  )
}

/** ISO strings of the same form compare in calendar order; a datetime is compared by its date. */
export function matchesDateRange(
  value: unknown,
  { start, end }: TableDateRange,
): boolean {
  if (typeof value !== 'string' || !value) return false
  const day = value.slice(0, 10)
  return (!start || day >= start) && (!end || day <= end)
}

function builtInTest(
  type: FilterType,
): (value: unknown, filter: any) => boolean {
  switch (type) {
    case 'numberRange':
      return matchesNumberRange
    case 'dateRange':
      return matchesDateRange
    case 'select':
      return (value, filter) => String(value) === String(filter)
    case 'multiSelect':
      return (value, filter: string[]) => filter.includes(String(value))
    default:
      return matchesTextFilter
  }
}

/** The engine's filter function for a column's filter. */
export function toEngineFilterFn<TData>(
  filter: TableColumnFilter<TData>,
): (
  row: { original: TData; getValue: (id: string) => unknown },
  columnId: string,
  value: unknown,
) => boolean {
  const custom = filter.fn
  if (custom) return (row, _id, value) => custom(row.original, value)
  const test = builtInTest(filter.type)
  return (row, id, value) => test(row.getValue(id), value)
}

/** Distinct values of a column, as options for a filter without its own. */
export function toFilterOptions(values: Iterable<unknown>): TableOption[] {
  const options: TableOption[] = []
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue
    options.push({ value: String(value), label: String(value) })
  }
  return options.sort((a, b) => a.label.localeCompare(b.label))
}

/** The text of a filter chip. */
export function describeTableFilter(
  column: TableColumn<any, any, any>,
  value: unknown,
  options: {
    labels: TableLabels
    locale?: string
    filterOptions?: TableOption[]
  },
): string {
  const { labels, locale, filterOptions } = options
  const filter = column.filter
  const optionLabel = (raw: string) =>
    filterOptions?.find((option) => option.value === raw)?.label ??
    column.badge?.labels?.[raw] ??
    raw
  let text: string
  switch (filter?.type) {
    case 'numberRange': {
      const { min, max } = value as TableNumberRange
      const format = (part: number) =>
        formatTableNumber(part, locale, column.number)
      if (min !== undefined && max !== undefined)
        text = `${format(min)} ${labels.rangeSeparator} ${format(max)}`
      else if (min !== undefined) text = `${labels.rangeMin} ${format(min)}`
      else text = `${labels.rangeMax} ${format(max as number)}`
      break
    }
    case 'dateRange': {
      const { start, end } = value as TableDateRange
      const format = (part: string) =>
        formatTableDate(part, locale, column.date)
      if (start && end)
        text = `${format(start)} ${labels.rangeSeparator} ${format(end)}`
      else if (start) text = `${labels.rangeMin} ${format(start)}`
      else text = `${labels.rangeMax} ${format(end as string)}`
      break
    }
    case 'select':
      text = optionLabel(String(value))
      break
    case 'multiSelect':
      text = (value as string[]).map(optionLabel).join(', ')
      break
    default:
      text = String(value)
  }
  return `${column.title}: ${text}`
}
