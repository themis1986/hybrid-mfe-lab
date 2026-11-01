// Selection logic of the tree components, identical in @repo/ui and @repo/ui-vue: change it in both.
// The state is the set of selected leaf values; a parent's state and the emitted value derive from it.

export interface TTreeNode {
  /** Unique across the whole tree, parents included. */
  value: string
  /** Shown in the list, and in the trigger while selected. */
  label: string
  /** Disables the node and, for a parent, its whole subtree. */
  disabled?: boolean
  children?: TTreeNode[]
}

/**
 * How a multiple value lists a fully selected parent: as its leaves (`'leaves'`), or as the parent itself in
 * place of its descendants (`'parents'`).
 */
export type TTreeValueMode = 'leaves' | 'parents'

export type TTreeNodeState = 'checked' | 'indeterminate' | 'unchecked'

export interface TTreeEntry {
  node: TTreeNode
  parent: TTreeEntry | undefined
  /** 1 for a root. */
  level: number
  /** The leaf values under the node, in tree order (the node itself for a leaf). */
  leaves: string[]
  /** Set on the node or inherited from an ancestor. */
  disabled: boolean
}

export type TTreeIndex = Map<string, TTreeEntry>

export interface TTreeRow {
  node: TTreeNode
  level: number
  setSize: number
  posInSet: number
}

export function isTreeParent(node: TTreeNode) {
  return !!node.children?.length
}

export function indexTree(roots: TTreeNode[]): TTreeIndex {
  const index: TTreeIndex = new Map()

  const visit = (node: TTreeNode, parent: TTreeEntry | undefined, level: number): string[] => {
    const entry: TTreeEntry = { node, parent, level, leaves: [], disabled: !!node.disabled || !!parent?.disabled }
    index.set(node.value, entry)
    entry.leaves = isTreeParent(node) ? node.children!.flatMap((child) => visit(child, entry, level + 1)) : [node.value]
    return entry.leaves
  }
  roots.forEach((root) => visit(root, undefined, 1))

  return index
}

export function nodeState(entry: TTreeEntry, selected: ReadonlySet<string>): TTreeNodeState {
  const count = entry.leaves.filter((leaf) => selected.has(leaf)).length
  return count === 0 ? 'unchecked' : count === entry.leaves.length ? 'checked' : 'indeterminate'
}

/** Selects every enabled leaf under the node, or clears them when they are all selected already. */
export function toggleSubtree(index: TTreeIndex, entry: TTreeEntry, selected: ReadonlySet<string>) {
  const enabled = entry.leaves.filter((leaf) => !index.get(leaf)!.disabled)
  const allSelected = enabled.every((leaf) => selected.has(leaf))
  const next = new Set(selected)
  for (const leaf of enabled) {
    if (allSelected) next.delete(leaf)
    else next.add(leaf)
  }
  return next
}

/** The selected leaves as a multiple value, in tree order. */
export function toValue(roots: TTreeNode[], index: TTreeIndex, selected: ReadonlySet<string>, mode: TTreeValueMode) {
  const value: string[] = []

  const visit = (node: TTreeNode) => {
    const state = nodeState(index.get(node.value)!, selected)
    if (state === 'unchecked') return
    if (!isTreeParent(node) || (mode === 'parents' && state === 'checked')) value.push(node.value)
    else node.children!.forEach(visit)
  }
  roots.forEach(visit)

  return value
}

/** A value as selected leaves: a parent stands for its leaves, whatever the mode. Unknown values are dropped. */
export function toLeaves(index: TTreeIndex, value: readonly string[]) {
  return new Set(value.flatMap((v) => index.get(v)?.leaves ?? []))
}

/** The parents of the given values, to expand so that they are visible. */
export function ancestorsOf(index: TTreeIndex, values: readonly string[]) {
  const ancestors = new Set<string>()
  for (const value of values) {
    for (let parent = index.get(value)?.parent; parent; parent = parent.parent) ancestors.add(parent.node.value)
  }
  return [...ancestors]
}

/** The rows a tree shows: every root, and the children of each expanded parent, in tree order. */
export function flattenVisible(roots: TTreeNode[], expanded: readonly string[]) {
  const rows: TTreeRow[] = []

  const visit = (nodes: TTreeNode[], level: number) => {
    nodes.forEach((node, i) => {
      rows.push({ node, level, setSize: nodes.length, posInSet: i + 1 })
      if (isTreeParent(node) && expanded.includes(node.value)) visit(node.children!, level + 1)
    })
  }
  visit(roots, 1)

  return rows
}
