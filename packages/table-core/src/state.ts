import type { TableColumnPinning, TableState, TableStateKey } from './types'

// The engine removed its global state callback, and offers one `on<Slice>Change` per slice. One writer per
// slice gives the table a single path: a controlled slice only reports the change, an uncontrolled one also
// stores it, and every change reaches the caller once, in one callback, in the same task.
const CHANGE_OPTION = {
  sorting: 'onSortingChange',
  columnFilters: 'onColumnFiltersChange',
  globalFilter: 'onGlobalFilterChange',
  pagination: 'onPaginationChange',
  rowSelection: 'onRowSelectionChange',
  expanded: 'onExpandedChange',
  grouping: 'onGroupingChange',
  columnVisibility: 'onColumnVisibilityChange',
  columnOrder: 'onColumnOrderChange',
  columnPinning: 'onColumnPinningChange',
  columnSizing: 'onColumnSizingChange',
} as const satisfies Record<TableStateKey, string>

const SLICES = Object.keys(CHANGE_OPTION) as TableStateKey[]

// Sorting or filtering changes what page one is, and the page the user was on may not exist any more.
const RESETS_PAGE: readonly TableStateKey[] = [
  'sorting',
  'columnFilters',
  'globalFilter',
]

interface StateAtom {
  get: () => any
  set: (updater: any) => void
}

/** The part of the engine the bridge needs; `bind` takes the table itself. */
export interface TableStateHost {
  atoms: Record<string, Pick<StateAtom, 'get'> | undefined>
  baseAtoms: Record<string, StateAtom | undefined>
  store: { get: () => Record<string, any> }
}

export type TableStateListener = (
  state: TableState,
  changed: TableStateKey[],
) => void

export function pickTableState(snapshot: Record<string, any>): TableState {
  const state = {} as Record<TableStateKey, unknown>
  for (const key of SLICES) state[key] = snapshot[key]
  state.globalFilter = snapshot.globalFilter ?? ''
  return state as TableState
}

export interface TableStateBridge {
  /** The `on<Slice>Change` options, for the engine. They never change. */
  handlers: Record<string, (updater: unknown) => void>
  /** Connects the engine, once it exists. */
  bind: (table: TableStateHost) => void
  /** The controlled slices: only the keys that are set, so the others stay with the engine. */
  toEngineState: (
    state: Partial<TableState> | undefined,
    pins: (
      pinning: Partial<TableColumnPinning> | undefined,
    ) => TableColumnPinning,
  ) => Partial<TableState>
  /** Sets several slices at once. */
  setState: (next: Partial<TableState>) => void
  /** Stops pending notifications, on unmount. */
  destroy: () => void
}

export function createTableStateBridge(options: {
  getControlled: () => Partial<TableState> | undefined
  onChange: () => TableStateListener | undefined
}): TableStateBridge {
  let table: TableStateHost | null = null
  let destroyed = false
  let scheduled = false
  const pending = new Map<TableStateKey, unknown>()

  const isResizing = () =>
    Boolean(table?.atoms.columnResizing?.get()?.isResizingColumn)

  const flush = () => {
    scheduled = false
    if (destroyed || !table || !pending.size) return
    // A resize drag reports its result when it ends, not on every move.
    const heldBack = pending.has('columnSizing') && isResizing()
    const changed = [...pending.keys()].filter(
      (key) => !(heldBack && key === 'columnSizing'),
    )
    if (!changed.length) return
    const state = pickTableState(table.store.get())
    for (const key of changed) {
      ;(state as unknown as Record<string, unknown>)[key] = pending.get(key)
      pending.delete(key)
    }
    options.onChange()?.(state, changed)
  }

  const schedule = () => {
    if (scheduled) return
    scheduled = true
    queueMicrotask(flush)
  }

  const write = (slice: TableStateKey, updater: unknown) => {
    if (!table) return
    const current = pending.has(slice)
      ? pending.get(slice)
      : table.atoms[slice]?.get()
    const next =
      typeof updater === 'function'
        ? (updater as (value: unknown) => unknown)(current)
        : updater
    if (Object.is(next, current)) return
    const controlled = options.getControlled()?.[slice] !== undefined
    // A controlled size still moves with the drag: its owner only hears about it at the end.
    if (!controlled || (slice === 'columnSizing' && isResizing())) {
      table.baseAtoms[slice]?.set(() => next)
    }
    pending.set(slice, next)
    schedule()
    if (RESETS_PAGE.includes(slice)) {
      write('pagination', (page: { pageIndex: number; pageSize: number }) =>
        page.pageIndex === 0 ? page : { ...page, pageIndex: 0 },
      )
    }
  }

  const handlers: Record<string, (updater: unknown) => void> = {}
  for (const slice of SLICES) {
    handlers[CHANGE_OPTION[slice]] = (updater) => write(slice, updater)
  }
  handlers.onColumnResizingChange = (updater) => {
    const atom = table?.baseAtoms.columnResizing
    if (!atom) return
    atom.set(updater)
    if (!isResizing() && pending.has('columnSizing')) schedule()
  }

  return {
    handlers,
    bind: (host) => {
      table = host
      destroyed = false
    },
    toEngineState: (state, pins) => {
      const engineState: Record<string, unknown> = {}
      if (state) {
        for (const key of SLICES) {
          const value = state[key]
          if (value !== undefined) engineState[key] = value
        }
        if (state.columnPinning) {
          engineState.columnPinning = pins(state.columnPinning)
        }
        // The drag owns the sizes until it ends.
        if (isResizing()) delete engineState.columnSizing
      }
      return engineState as Partial<TableState>
    },
    setState: (next) => {
      for (const key of Object.keys(next) as TableStateKey[]) {
        write(key, next[key])
      }
    },
    destroy: () => {
      destroyed = true
      pending.clear()
    },
  }
}
