// What the table's body shows, in order: rows, and the detail panel under an open row as its own item with
// its own height. Both the virtualizer and the plain body read this one list.

export interface TableDisplayRow {
  id: string
  depth: number
  subRows: readonly TableDisplayRow[]
  getIsExpanded: () => boolean
  /** A group row (when grouping): it opens to its rows, never to a detail panel. */
  getIsGrouped?: () => boolean
}

export interface TableDisplayItem<TRow> {
  kind: 'row' | 'detail'
  /** The stable key: the row's id, or `<id>:detail`. */
  key: string
  row: TRow
  /** Position in the list, from 0. */
  index: number
  /** For a tree: position among the row's siblings, from 1, and their number. */
  positionInSet?: number
  setSize?: number
}

export function tableDetailKey(rowId: string): string {
  return `${rowId}:detail`
}

export function toDisplayItems<TRow extends TableDisplayRow>(
  rows: readonly TRow[],
  { detail = false, tree = false }: { detail?: boolean; tree?: boolean } = {},
): TableDisplayItem<TRow>[] {
  const items: TableDisplayItem<TRow>[] = []
  // Siblings aren't always adjacent in the flat list (children sit between them), so sets are counted by
  // walking the depths: at each row, the counter of its depth goes up and deeper counters end.
  const openSets: { size: number; items: TableDisplayItem<TRow>[] }[] = []
  const closeDeeper = (depth: number) => {
    while (openSets.length > depth + 1) {
      const set = openSets.pop()!
      for (const member of set.items) member.setSize = set.size
    }
  }

  for (const row of rows) {
    const item: TableDisplayItem<TRow> = {
      kind: 'row',
      key: row.id,
      row,
      index: items.length,
    }
    items.push(item)
    if (tree) {
      closeDeeper(row.depth)
      const set = (openSets[row.depth] ??= { size: 0, items: [] })
      set.size += 1
      set.items.push(item)
      item.positionInSet = set.size
    }
    if (detail && row.getIsExpanded() && !row.getIsGrouped?.()) {
      items.push({
        kind: 'detail',
        key: tableDetailKey(row.id),
        row,
        index: items.length,
      })
    }
  }
  if (tree) closeDeeper(-1)
  return items
}

/**
 * The virtual rows to render: the range in view plus rows that must stay mounted out of view, because the
 * focus, an open menu or an edit's draft lives in them. Sorted, as the virtualizer expects.
 */
export function withRetainedTableRows(
  range: readonly number[],
  retained: readonly (number | undefined)[],
): number[] {
  const extra = retained.filter(
    (index): index is number => index !== undefined && !range.includes(index),
  )
  if (!extra.length) return range as number[]
  return [...range, ...new Set(extra)].sort((a, b) => a - b)
}

export const TABLE_ROW_ESTIMATE = { compact: 32, comfortable: 44 } as const
export const TABLE_DEFAULT_OVERSCAN = 8
