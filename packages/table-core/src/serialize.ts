import { tableColumnId } from './columns'
import { isSyntheticTableColumn } from './options'
import type {
  TableColumnData,
  TableColumnFilterValue,
  TableColumnPinning,
  TableState,
  TableStateKey,
} from './types'

// Selection and expansion are about one session's rows, and can be huge, so they are left out by default.
const DEFAULT_INCLUDE: TableStateKey[] = [
  'sorting',
  'columnFilters',
  'globalFilter',
  'pagination',
  'grouping',
  'columnVisibility',
  'columnOrder',
  'columnPinning',
  'columnSizing',
]

function isEmptySlice(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') {
    return Object.keys(value as object).length === 0
  }
  return false
}

function withoutSyntheticPins(pinning: TableColumnPinning) {
  const start = pinning.start.filter((id) => !isSyntheticTableColumn(id))
  const end = pinning.end.filter((id) => !isSyntheticTableColumn(id))
  return start.length || end.length ? { start, end } : undefined
}

/** Text for a URL parameter or localStorage. Empty slices are left out, so a default table gives `{}`. */
export function serializeTableState(
  state: Partial<TableState>,
  { include = DEFAULT_INCLUDE }: { include?: TableStateKey[] } = {},
): string {
  const picked: Partial<Record<TableStateKey, unknown>> = {}
  for (const key of include) {
    // The table's own pinned columns aren't the user's choice: they come back by themselves.
    const value =
      key === 'columnPinning' && state.columnPinning
        ? withoutSyntheticPins(state.columnPinning)
        : state[key]
    if (!isEmptySlice(value)) picked[key] = value
  }
  return JSON.stringify(picked)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * The state in a serialized text. It may be old or hand-edited, so anything malformed or naming a column
 * that no longer exists is dropped instead of reaching the engine; bad text gives an empty state.
 */
export function parseTableState(
  text: string | null | undefined,
  columns: readonly TableColumnData<any>[],
): Partial<TableState> {
  if (!text) return {}
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return {}
  }
  if (!isRecord(raw)) return {}
  const ids = new Set(columns.map(tableColumnId))
  const known = (id: unknown): id is string =>
    typeof id === 'string' && ids.has(id)
  const state: Partial<TableState> = {}

  if (Array.isArray(raw.sorting)) {
    state.sorting = raw.sorting.flatMap((item) =>
      isRecord(item) && known(item.id)
        ? [{ id: item.id, desc: item.desc === true }]
        : [],
    )
  }
  if (Array.isArray(raw.columnFilters)) {
    state.columnFilters = raw.columnFilters.filter(
      (item): item is TableColumnFilterValue =>
        isRecord(item) && known(item.id) && item.value !== undefined,
    )
  }
  if (typeof raw.globalFilter === 'string') {
    state.globalFilter = raw.globalFilter
  }
  if (isRecord(raw.pagination)) {
    const { pageIndex, pageSize } = raw.pagination
    if (
      Number.isInteger(pageIndex) &&
      Number.isInteger(pageSize) &&
      (pageIndex as number) >= 0 &&
      (pageSize as number) > 0
    ) {
      state.pagination = {
        pageIndex: pageIndex as number,
        pageSize: pageSize as number,
      }
    }
  }
  if (isRecord(raw.rowSelection)) {
    state.rowSelection = Object.fromEntries(
      Object.keys(raw.rowSelection)
        .filter((id) => raw.rowSelection && (raw.rowSelection as any)[id])
        .map((id) => [id, true as const]),
    )
  }
  if (raw.expanded === true) state.expanded = true
  else if (isRecord(raw.expanded)) {
    state.expanded = Object.fromEntries(
      Object.entries(raw.expanded).map(([id, value]) => [id, value === true]),
    )
  }
  if (Array.isArray(raw.grouping)) {
    state.grouping = raw.grouping.filter(known)
  }
  if (isRecord(raw.columnVisibility)) {
    state.columnVisibility = Object.fromEntries(
      Object.entries(raw.columnVisibility)
        .filter(([id]) => known(id))
        .map(([id, value]) => [id, value !== false]),
    )
  }
  if (Array.isArray(raw.columnOrder)) {
    state.columnOrder = raw.columnOrder.filter(known)
  }
  if (isRecord(raw.columnPinning)) {
    const { start, end } = raw.columnPinning
    state.columnPinning = {
      start: Array.isArray(start) ? start.filter(known) : [],
      end: Array.isArray(end) ? end.filter(known) : [],
    }
  }
  if (isRecord(raw.columnSizing)) {
    state.columnSizing = Object.fromEntries(
      Object.entries(raw.columnSizing).filter(
        (entry): entry is [string, number] =>
          known(entry[0]) &&
          typeof entry[1] === 'number' &&
          Number.isFinite(entry[1]) &&
          entry[1] > 0,
      ),
    )
  }
  return state
}
