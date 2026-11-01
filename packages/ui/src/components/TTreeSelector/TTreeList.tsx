import { Check, ChevronRight, Minus } from 'lucide-react'
import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../lib/cn'
import {
  flattenVisible,
  isTreeParent,
  nodeState,
  type TTreeEntry,
  type TTreeIndex,
  type TTreeNode,
} from '../../lib/tree'
import {
  tCheckboxIconClasses,
  tCheckboxIndeterminateIconClasses,
  tCheckboxIndicatorClasses,
  tCheckboxVariants,
} from '../TCheckbox/TCheckbox.variants'
import { TIcon } from '../TIcon'
import {
  tRadioIndicatorClasses,
  tRadioVariants,
} from '../TRadioGroup/TRadioGroup.variants'
import {
  tSelectIndicatorClasses,
  tSelectViewportClasses,
} from '../TSelect/TSelect.variants'
import {
  tTreeChevronClasses,
  tTreeChevronSpacerClasses,
  tTreeItemClasses,
  tTreeLabelClasses,
  tTreeParentLabelClasses,
} from './TTreeSelector.variants'

const TYPEAHEAD_RESET_MS = 500

interface TTreeListProps {
  id: string
  options: TTreeNode[]
  index: TTreeIndex
  expanded: string[]
  /** The selected leaves. */
  selected: ReadonlySet<string>
  multiple: boolean
  onToggleExpanded: (value: string) => void
  onSelect: (entry: TTreeEntry) => void
  'aria-label'?: string
  'aria-labelledby'?: string
}

// TTreeSelector's list. Radix has no tree, so this one is written to behave like Reka's (the Vue library's
// TTreeSelector), with the same roles and data attributes:
// - the rows are flat, in tree order, with aria-level/setsize/posinset; a roving tabindex keeps one focusable;
// - Up/Down/Home/End move between enabled rows, Right expands a parent or moves to its first child, Left
//   collapses it or moves to the parent, Enter/Space select, typing jumps to a matching label, Tab is held;
// - mounting focuses the first selected row (or the first enabled one).
export function TTreeList({
  id,
  options,
  index,
  expanded,
  selected,
  multiple,
  onToggleExpanded,
  onSelect,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: TTreeListProps) {
  const rows = flattenVisible(options, expanded)
  const baseId = useId()
  const rowIds = useMemo(
    () =>
      new Map([...index.keys()].map((value, i) => [value, `${baseId}-${i}`])),
    [index, baseId],
  )
  const [focused, setFocused] = useState<string>()
  const typeahead = useRef({ text: '', timer: 0 })

  const entryOf = (node: TTreeNode) => index.get(node.value)!
  const isEnabled = (i: number) => !entryOf(rows[i].node).disabled
  // A parent is selected (aria-selected) only in multiple mode, once its whole subtree is.
  const isSelected = (node: TTreeNode) =>
    (multiple || !isTreeParent(node)) &&
    nodeState(entryOf(node), selected) === 'checked'
  const tabStop = rows.some(
    (row) => row.node.value === focused && !entryOf(row.node).disabled,
  )
    ? focused
    : rows.find((row) => !entryOf(row.node).disabled)?.node.value

  useEffect(() => {
    const target =
      rows.find((row) => !entryOf(row.node).disabled && isSelected(row.node)) ??
      rows.find((row) => !entryOf(row.node).disabled)
    if (target)
      document
        .getElementById(rowIds.get(target.node.value)!)
        ?.focus({ preventScroll: true })
  }, [])

  function focusRow(i: number) {
    const row = rows[i]
    if (row) document.getElementById(rowIds.get(row.node.value)!)?.focus()
  }

  // The next enabled row from `from` in direction `step`, or `from` itself at the end of the list.
  function step(from: number, direction: 1 | -1) {
    for (let i = from + direction; i >= 0 && i < rows.length; i += direction) {
      if (isEnabled(i)) return i
    }
    return from
  }

  // The first enabled child of the parent at `i`, or -1.
  function firstChild(i: number) {
    for (let j = i + 1; j < rows.length && rows[j].level > rows[i].level; j++) {
      if (rows[j].level === rows[i].level + 1 && isEnabled(j)) return j
    }
    return -1
  }

  // Jumps to the next label that starts with the typed text. A single repeated key cycles through the
  // labels that start with it.
  function search(key: string, current: number) {
    const state = typeahead.current
    window.clearTimeout(state.timer)
    state.text += key.toLowerCase()
    state.timer = window.setTimeout(() => (state.text = ''), TYPEAHEAD_RESET_MS)

    const start = state.text.length === 1 ? current + 1 : Math.max(current, 0)
    for (let n = 0; n < rows.length; n++) {
      const i = (start + n) % rows.length
      if (
        isEnabled(i) &&
        rows[i].node.label.toLowerCase().startsWith(state.text)
      ) {
        focusRow(i)
        return
      }
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    const current = rows.findIndex((row) => row.node.value === focused)
    const row = rows[current]
    const entry = row && entryOf(row.node)
    const isOpenParent =
      !!entry && isTreeParent(row.node) && expanded.includes(row.node.value)

    switch (event.key) {
      case 'ArrowDown':
        focusRow(step(current, 1))
        break
      case 'ArrowUp':
        focusRow(step(current, -1))
        break
      case 'Home':
        focusRow(step(-1, 1))
        break
      case 'End':
        focusRow(step(rows.length, -1))
        break
      case 'ArrowRight':
        if (!entry || entry.disabled || !isTreeParent(row.node)) break
        if (isOpenParent) focusRow(firstChild(current))
        else onToggleExpanded(row.node.value)
        break
      case 'ArrowLeft':
        if (!entry || entry.disabled) break
        if (isOpenParent) onToggleExpanded(row.node.value)
        else if (entry.parent)
          focusRow(rows.findIndex((r) => r.node === entry.parent!.node))
        break
      case 'Enter':
      case ' ':
        if (entry) onSelect(entry)
        break
      case 'Tab':
        break
      default:
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        )
          return
        search(event.key, current)
    }
    event.preventDefault()
  }

  return (
    <div
      id={id}
      role="tree"
      aria-multiselectable={multiple || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={tSelectViewportClasses}
      onKeyDown={onKeyDown}
    >
      {rows.map((row) => {
        const { node, level } = row
        const entry = entryOf(node)
        const parent = isTreeParent(node)
        const isExpanded = parent && expanded.includes(node.value)
        const state = nodeState(entry, selected)

        return (
          <div
            key={node.value}
            id={rowIds.get(node.value)}
            data-slot="tree-item"
            role="treeitem"
            aria-level={level}
            aria-setsize={row.setSize}
            aria-posinset={row.posInSet}
            aria-expanded={parent ? isExpanded : undefined}
            aria-selected={isSelected(node)}
            aria-disabled={entry.disabled || undefined}
            data-indent={level}
            data-selected={isSelected(node) ? '' : undefined}
            data-expanded={isExpanded ? '' : undefined}
            data-disabled={entry.disabled ? '' : undefined}
            tabIndex={node.value === tabStop ? 0 : -1}
            style={{ '--t-tree-level': level } as CSSProperties}
            className={tTreeItemClasses}
            onFocus={() => setFocused(node.value)}
            onClick={() => onSelect(entry)}
          >
            {parent ? (
              <TIcon
                icon={ChevronRight}
                className={tTreeChevronClasses}
                onClick={(event) => {
                  event.stopPropagation()
                  if (!entry.disabled) onToggleExpanded(node.value)
                }}
              />
            ) : (
              <span aria-hidden className={tTreeChevronSpacerClasses} />
            )}
            {multiple ? (
              <span
                aria-hidden
                className={cn(
                  tCheckboxVariants({ size: 'sm' }),
                  tSelectIndicatorClasses,
                )}
              >
                {state !== 'unchecked' && (
                  <span
                    data-state={state}
                    className={tCheckboxIndicatorClasses}
                  >
                    <TIcon icon={Check} className={tCheckboxIconClasses} />
                    <TIcon
                      icon={Minus}
                      className={tCheckboxIndeterminateIconClasses}
                    />
                  </span>
                )}
              </span>
            ) : (
              !parent && (
                <span
                  aria-hidden
                  className={cn(
                    tRadioVariants({ size: 'sm' }),
                    tSelectIndicatorClasses,
                  )}
                >
                  {state === 'checked' && (
                    <span className={tRadioIndicatorClasses} />
                  )}
                </span>
              )
            )}
            <span
              className={cn(
                tTreeLabelClasses,
                !multiple && parent && tTreeParentLabelClasses,
              )}
            >
              {node.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
