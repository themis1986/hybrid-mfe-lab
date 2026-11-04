import type { Table } from '@tanstack/table-core'
import type { TableEngineFeatures } from './features'
import type { TableRowData } from './types'

// Column widths and pin offsets are CSS variables on one element, written directly. A resize drag then
// changes those variables and nothing else: no framework re-renders a row for it.

export function tableColumnVar(index: number): string {
  return `--t-col-${index}`
}

export function tablePinVar(index: number): string {
  return `--t-pin-${index}`
}

/** The inline style of a cell, in either framework. */
export function tableCellVars(
  index: number,
  pinned: false | 'start' | 'end',
): Record<string, string> {
  const vars: Record<string, string> = {
    '--t-cell-w': `var(${tableColumnVar(index)})`,
  }
  if (pinned === 'start') {
    vars.insetInlineStart = `var(${tablePinVar(index)})`
  } else if (pinned === 'end') {
    vars.insetInlineEnd = `var(${tablePinVar(index)})`
  }
  return vars
}

export function writeTableColumnVars<TData extends TableRowData>(
  element: HTMLElement,
  table: Table<TableEngineFeatures, TData>,
): void {
  const style = element.style
  let total = 0
  let pinnedStart = 0
  let pinnedEnd = 0
  for (const column of table.getVisibleLeafColumns()) {
    const index = column.columnDef.meta?.index
    if (index === undefined) continue
    const size = column.getSize()
    total += size
    style.setProperty(tableColumnVar(index), `${size}px`)
    const pinned = column.getIsPinned()
    if (pinned === 'start') {
      pinnedStart += size
      style.setProperty(tablePinVar(index), `${column.getStart('start')}px`)
    } else if (pinned === 'end') {
      pinnedEnd += size
      style.setProperty(tablePinVar(index), `${column.getAfter('end')}px`)
    }
  }
  style.setProperty('--t-table-width', `${total}px`)
  // Scroll padding, so a focused cell never lands under a pinned one.
  style.setProperty('--t-pin-start-w', `${pinnedStart}px`)
  style.setProperty('--t-pin-end-w', `${pinnedEnd}px`)
}

/** Keeps the variables up to date with the engine's state. Returns the clean-up. */
export function bindTableColumnVars<TData extends TableRowData>(
  element: HTMLElement,
  table: Table<TableEngineFeatures, TData>,
): () => void {
  const write = () => writeTableColumnVars(element, table)
  write()
  const subscriptions = [
    table.atoms.columnSizing.subscribe(write),
    table.atoms.columnVisibility.subscribe(write),
    table.atoms.columnPinning.subscribe(write),
    table.atoms.columnOrder.subscribe(write),
    table.atoms.grouping.subscribe(write),
  ]
  return () => subscriptions.forEach((item) => item.unsubscribe())
}

/**
 * The scroller's width (a detail panel's content stays that wide while the columns scroll sideways) and the
 * header's height (what a virtualized body starts after, and what scrolling to a row must clear).
 */
export function observeTableScroller(
  root: HTMLElement,
  scroller: HTMLElement,
  head: HTMLElement | null,
  onHeaderHeight?: (height: number) => void,
): () => void {
  const measure = () => {
    root.style.setProperty('--t-scroller-w', `${scroller.clientWidth}px`)
    if (head) {
      const height = head.offsetHeight
      scroller.style.scrollPaddingTop = `${height}px`
      onHeaderHeight?.(height)
    }
  }
  measure()
  if (typeof ResizeObserver === 'undefined') return () => {}
  const observer = new ResizeObserver(measure)
  observer.observe(scroller)
  if (head) observer.observe(head)
  return () => observer.disconnect()
}
