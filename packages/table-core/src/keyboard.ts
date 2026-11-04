// The grid's keyboard behaviour (WAI-ARIA grid pattern): one tab stop that moves with the arrow keys. It works
// on DOM attributes and native events, so both frameworks share it; a native listener also never sees key
// presses from a portalled menu or popover, which React's synthetic events would bubble here.

export const TABLE_HEADER_ROW = '__header'
/** The one cell of a full-width row (a detail panel, the empty state). */
export const TABLE_FULL_ROW_COLUMN = '*'

const FOCUSABLE =
  'button, a[href], input, select, textarea, [tabindex]:not([data-col])'

export interface TableGridPosition {
  /** 0 is the header row, 1 the first body item. */
  row: number
  col: number
}

export interface TableGridSize {
  rows: number
  cols: number
  /** How many rows PageUp and PageDown move. */
  pageRows: number
}

/** The position a key moves to, or `null` for a key that doesn't move. */
export function nextTableGridPosition(
  from: TableGridPosition,
  key: string,
  { ctrl = false, rtl = false }: { ctrl?: boolean; rtl?: boolean },
  { rows, cols, pageRows }: TableGridSize,
): TableGridPosition | null {
  const lastRow = rows
  const lastCol = cols - 1
  const clampRow = (row: number) => Math.min(lastRow, Math.max(0, row))
  const clampCol = (col: number) => Math.min(lastCol, Math.max(0, col))
  switch (key) {
    case 'ArrowUp':
      return { row: clampRow(from.row - 1), col: from.col }
    case 'ArrowDown':
      return { row: clampRow(from.row + 1), col: from.col }
    case 'ArrowLeft':
      return { row: from.row, col: clampCol(from.col + (rtl ? 1 : -1)) }
    case 'ArrowRight':
      return { row: from.row, col: clampCol(from.col + (rtl ? -1 : 1)) }
    case 'Home':
      return ctrl ? { row: 0, col: 0 } : { row: from.row, col: 0 }
    case 'End':
      return ctrl
        ? { row: lastRow, col: lastCol }
        : { row: from.row, col: lastCol }
    case 'PageUp':
      return { row: clampRow(from.row - pageRows), col: from.col }
    case 'PageDown':
      return { row: clampRow(from.row + pageRows), col: from.col }
    default:
      return null
  }
}

export interface TableGridOptions {
  /** The element holding the header and body cells. */
  root: HTMLElement
  /** Keys of the body items, in display order. */
  getRowKeys: () => readonly string[]
  /** Visible column ids, in display order. */
  getColumnIds: () => readonly string[]
  getPageRows: () => number
  /** Brings a body item into the DOM; the focus lands once `sync` finds it. */
  scrollToItem: (index: number) => void
  /** A cell asked to start editing. Returns whether it did. */
  startEdit?: (rowKey: string, columnId: string) => boolean
  /** Arrow keys on a column's resize handle: the change in width, in pixels. */
  resizeColumn?: (columnId: string, delta: number) => void
  /** The active row changed, so a virtualized body can keep it mounted. */
  onActiveRowChange?: (rowKey: string | null) => void
}

export interface TableGridController {
  /** Call after every render of the body: re-applies the tab stop and any pending focus. */
  sync: () => void
  /** The body item holding the tab stop, if any. */
  getActiveRowKey: () => string | null
  focusCell: (rowKey: string, columnId: string) => void
  destroy: () => void
}

function cellSelector(rowKey: string, columnId: string) {
  const row = `[data-row-key="${CSS.escape(rowKey)}"]`
  return (
    `${row} [data-col="${CSS.escape(columnId)}"],` +
    `${row} [data-col="${TABLE_FULL_ROW_COLUMN}"]`
  )
}

export function createTableGrid(
  options: TableGridOptions,
): TableGridController {
  const { root } = options
  let activeRow = TABLE_HEADER_ROW
  let activeColumn: string | null = null
  let tabStop: HTMLElement | null = null
  let pendingFocus = false
  let hadFocus = false
  let activeIndex = 0

  const findCell = (rowKey: string, columnId: string | null) => {
    if (columnId === null) {
      return root.querySelector<HTMLElement>(
        `[data-row-key="${CSS.escape(rowKey)}"] [data-col]`,
      )
    }
    return root.querySelector<HTMLElement>(cellSelector(rowKey, columnId))
  }

  const setTabStop = (cell: HTMLElement | null) => {
    if (cell === tabStop) return
    if (tabStop) tabStop.setAttribute('tabindex', '-1')
    tabStop = cell
    if (cell) cell.setAttribute('tabindex', '0')
  }

  const setActive = (rowKey: string, columnId: string | null) => {
    const rowChanged = rowKey !== activeRow
    activeRow = rowKey
    activeColumn = columnId
    if (rowKey !== TABLE_HEADER_ROW) {
      const index = options.getRowKeys().indexOf(rowKey)
      if (index >= 0) activeIndex = index
    }
    if (rowChanged) {
      options.onActiveRowChange?.(rowKey === TABLE_HEADER_ROW ? null : rowKey)
    }
  }

  const sync = () => {
    let cell = findCell(activeRow, activeColumn)
    // The active row is gone (deleted, filtered out, paged away): the tab stop or the focus moves to the
    // same position, and to the header when the body is empty.
    if (!cell && activeRow !== TABLE_HEADER_ROW) {
      const keys = options.getRowKeys()
      if (!keys.includes(activeRow)) {
        const key = keys[Math.min(activeIndex, keys.length - 1)]
        setActive(key ?? TABLE_HEADER_ROW, activeColumn)
        cell = findCell(activeRow, activeColumn)
      }
    }
    if (!cell) cell = findCell(TABLE_HEADER_ROW, activeColumn)
    if (!cell) cell = findCell(TABLE_HEADER_ROW, null)
    setTabStop(cell)
    const focusLost =
      hadFocus &&
      (!document.activeElement || document.activeElement === document.body)
    if (cell && (pendingFocus || focusLost)) {
      if (cell.closest(`[data-row-key="${CSS.escape(activeRow)}"]`)) {
        pendingFocus = false
        hadFocus = true
        cell.focus()
      }
    }
  }

  const moveTo = (position: TableGridPosition) => {
    const keys = options.getRowKeys()
    const columns = options.getColumnIds()
    const rowKey =
      position.row === 0
        ? TABLE_HEADER_ROW
        : (keys[position.row - 1] ?? TABLE_HEADER_ROW)
    const columnId = columns[position.col] ?? activeColumn
    setActive(rowKey, columnId)
    const cell = findCell(rowKey, columnId)
    if (cell && cell.closest(`[data-row-key="${CSS.escape(rowKey)}"]`)) {
      setTabStop(cell)
      // Keeps the row in view through scrollIntoView, within the scroller's scroll padding.
      cell.focus()
      hadFocus = true
      if (position.row > 0) options.scrollToItem(position.row - 1)
    } else {
      pendingFocus = true
      options.scrollToItem(position.row - 1)
    }
  }

  const clickCellControl = (control: HTMLElement, shift: boolean) => {
    if (control.dataset.tActivate === 'menu') {
      // Menu triggers open on a key press on them, not on a click event.
      control.focus()
      control.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      )
      return
    }
    control.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        shiftKey: shift,
      }),
    )
  }

  const cellWidgets = (cell: HTMLElement) =>
    [...cell.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (widget) => !widget.hasAttribute('disabled'),
    )

  const activate = (cell: HTMLElement, rowKey: string, shift: boolean) => {
    const columnId = cell.dataset.col ?? ''
    if (
      cell.dataset.editable !== undefined &&
      options.startEdit?.(rowKey, columnId)
    ) {
      return
    }
    const control = cell.querySelector<HTMLElement>('[data-t-activate]')
    if (control) {
      clickCellControl(control, shift)
      return
    }
    // A custom widget: focus moves into it, and Escape brings it back to the cell.
    cellWidgets(cell)[0]?.focus()
  }

  // F2 goes to the cell's other controls (a header's filter and menu buttons, its resize handle).
  const enterWidgets = (cell: HTMLElement, rowKey: string) => {
    const columnId = cell.dataset.col ?? ''
    if (
      cell.dataset.editable !== undefined &&
      options.startEdit?.(rowKey, columnId)
    ) {
      return
    }
    const widgets = cellWidgets(cell)
    const first =
      widgets.find((widget) => !widget.hasAttribute('data-t-activate')) ??
      widgets[0]
    first?.focus()
  }

  // Inside a cell: Escape returns to it, and the side arrows walk its controls (or resize, on a handle).
  const onWidgetKey = (
    event: KeyboardEvent,
    cell: HTMLElement,
    target: HTMLElement,
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      cell.focus()
      return
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    if (target.matches('input, select, textarea')) return
    const rtl = getComputedStyle(root).direction === 'rtl'
    const forward = (event.key === 'ArrowRight') !== rtl
    if (target.dataset.tResize !== undefined) {
      event.preventDefault()
      options.resizeColumn?.(cell.dataset.col ?? '', forward ? 10 : -10)
      return
    }
    const widgets = cellWidgets(cell)
    const index = widgets.indexOf(target)
    const next = widgets[index + (forward ? 1 : -1)]
    if (next) {
      event.preventDefault()
      next.focus()
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const cell = target.closest<HTMLElement>('[data-col]')
    if (!cell || !root.contains(cell)) return
    // An editor handles its own keys. This listener runs first, and moving the focus would commit the edit.
    if (cell.dataset.editing !== undefined) return
    if (target !== cell) {
      onWidgetKey(event, cell, target)
      return
    }

    const rowElement = cell.closest<HTMLElement>('[data-row-key]')
    const rowKey = rowElement?.dataset.rowKey
    if (!rowKey) return

    if (event.key === 'Enter') {
      event.preventDefault()
      activate(cell, rowKey, event.shiftKey)
      return
    }
    if (event.key === 'F2') {
      event.preventDefault()
      enterWidgets(cell, rowKey)
      return
    }
    if (event.key === ' ') {
      event.preventDefault()
      const select =
        rowElement.querySelector<HTMLElement>('[data-t-select]') ??
        (rowKey === TABLE_HEADER_ROW
          ? cell.querySelector<HTMLElement>('[data-t-activate]')
          : null)
      if (select) clickCellControl(select, event.shiftKey)
      return
    }

    const keys = options.getRowKeys()
    const columns = options.getColumnIds()
    const fromRow = rowKey === TABLE_HEADER_ROW ? 0 : keys.indexOf(rowKey) + 1
    const columnId =
      cell.dataset.col === TABLE_FULL_ROW_COLUMN
        ? activeColumn
        : (cell.dataset.col ?? null)
    const fromCol = Math.max(0, columnId ? columns.indexOf(columnId) : 0)
    const rtl = getComputedStyle(root).direction === 'rtl'
    const next = nextTableGridPosition(
      { row: fromRow, col: fromCol },
      event.key,
      { ctrl: event.ctrlKey || event.metaKey, rtl },
      {
        rows: keys.length,
        cols: columns.length,
        pageRows: options.getPageRows(),
      },
    )
    if (!next) return
    event.preventDefault()
    if (next.row !== fromRow || next.col !== fromCol) moveTo(next)
  }

  const onFocusIn = (event: FocusEvent) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-col]',
    )
    if (!cell || !root.contains(cell)) return
    const rowKey = cell.closest<HTMLElement>('[data-row-key]')?.dataset.rowKey
    if (!rowKey) return
    hadFocus = true
    const columnId =
      cell.dataset.col === TABLE_FULL_ROW_COLUMN
        ? activeColumn
        : (cell.dataset.col ?? null)
    setActive(rowKey, columnId)
    setTabStop(cell)
  }

  const onFocusOut = (event: FocusEvent) => {
    // A row unmounting takes focus to nothing, with no relatedTarget: that one stays "had focus".
    const next = event.relatedTarget as Node | null
    if (next && !root.contains(next)) hadFocus = false
    else if (
      !next &&
      event.target instanceof HTMLElement &&
      event.target.isConnected
    )
      hadFocus = false
  }

  // A click on a control may not focus it (Safari), but its row must still stay mounted while, say, its menu
  // is open.
  const onPointerDown = (event: PointerEvent) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-col]',
    )
    const rowKey = cell?.closest<HTMLElement>('[data-row-key]')?.dataset.rowKey
    if (!cell || !rowKey || !root.contains(cell)) return
    setActive(
      rowKey,
      cell.dataset.col === TABLE_FULL_ROW_COLUMN
        ? activeColumn
        : (cell.dataset.col ?? null),
    )
    setTabStop(cell)
  }

  root.addEventListener('pointerdown', onPointerDown)
  root.addEventListener('keydown', onKeyDown)
  root.addEventListener('focusin', onFocusIn)
  root.addEventListener('focusout', onFocusOut)

  return {
    sync,
    getActiveRowKey: () => (activeRow === TABLE_HEADER_ROW ? null : activeRow),
    focusCell: (rowKey, columnId) => {
      setActive(rowKey, columnId)
      pendingFocus = true
      sync()
    },
    destroy: () => {
      root.removeEventListener('pointerdown', onPointerDown)
      root.removeEventListener('keydown', onKeyDown)
      root.removeEventListener('focusin', onFocusIn)
      root.removeEventListener('focusout', onFocusOut)
    },
  }
}
