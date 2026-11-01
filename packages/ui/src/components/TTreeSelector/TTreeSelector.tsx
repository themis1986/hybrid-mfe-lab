import * as Popover from '@radix-ui/react-popover'
import { ChevronDown } from 'lucide-react'
import { type CSSProperties, type KeyboardEvent, useId, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import {
  ancestorsOf,
  indexTree,
  isTreeParent,
  type TTreeEntry,
  toggleSubtree,
  toLeaves,
  toValue,
} from '../../lib/tree'
import { TIcon } from '../TIcon'
import { tInputVariants } from '../TInput/TInput.variants'
import {
  tSelectChevronClasses,
  tSelectContentClasses,
  tSelectTriggerClasses,
  tSelectValueClasses,
} from '../TSelect/TSelect.variants'
import { TTreeList } from './TTreeList'
import type { TTreeSelectorProps } from './types'

const contentStyle = {
  '--t-select-trigger-width': 'var(--radix-popover-trigger-width)',
  '--t-select-available-height': 'var(--radix-popover-content-available-height)',
} as CSSProperties

const toArray = (value: string | string[] | undefined) => (value === undefined ? [] : Array.isArray(value) ? value : [value])

// A select whose options are a tree (`options` nodes with `children`), in a Radix Popover. Single mode picks
// one leaf and closes; parents only expand. With `multiple`, each row has a checkbox, a parent selects or
// clears its whole subtree and shows a partial state, and `valueMode` decides whether a fully selected parent
// appears in the value as itself or as its leaves. The selection logic is lib/tree.ts, shared with Vue.
// Name it with `aria-label` or a <label htmlFor> pointing at `id`.
export function TTreeSelector(props: TTreeSelectorProps) {
  const {
    options,
    placeholder,
    size,
    invalid,
    disabled,
    name,
    required,
    id,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
  } = props
  const multiple = !!props.multiple
  const index = useMemo(() => indexTree(options), [options])
  const [uncontrolledValue, setUncontrolledValue] = useState(() => toArray(props.defaultValue))
  const value = props.value === undefined ? uncontrolledValue : toArray(props.value)
  const selected = toLeaves(index, value)
  // The value as displayed and submitted: in multiple mode, rewritten for the value mode.
  const shown = multiple ? toValue(options, index, selected, props.valueMode ?? 'leaves') : value.slice(0, 1)
  const labels = shown.flatMap((v) => index.get(v)?.node.label ?? [])

  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const treeId = `${useId()}-tree`

  // Opening also expands the parents of the selection, so it is visible.
  function onOpenChange(next: boolean) {
    if (next) setExpanded((current) => [...new Set([...current, ...ancestorsOf(index, shown)])])
    setOpen(next)
  }

  function toggleExpanded(nodeValue: string) {
    setExpanded((current) =>
      current.includes(nodeValue) ? current.filter((v) => v !== nodeValue) : [...current, nodeValue],
    )
  }

  function commit(leaves: ReadonlySet<string>) {
    const next = toValue(options, index, leaves, (multiple && props.valueMode) || 'leaves')
    if (props.value === undefined) setUncontrolledValue(next)
    if (props.multiple) props.onValueChange?.(next)
    else props.onValueChange?.(next[0])
  }

  function select(entry: TTreeEntry) {
    if (entry.disabled) return
    if (multiple) {
      commit(toggleSubtree(index, entry, selected))
    } else if (isTreeParent(entry.node)) {
      toggleExpanded(entry.node.value)
    } else {
      commit(new Set([entry.node.value]))
      setOpen(false)
    }
  }

  function onTriggerKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      onOpenChange(true)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          data-slot="select-trigger"
          id={id}
          role="combobox"
          aria-haspopup="tree"
          aria-expanded={open}
          aria-controls={open ? treeId : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={invalid || undefined}
          data-placeholder={labels.length ? undefined : ''}
          disabled={disabled}
          className={cn(tInputVariants({ size }), tSelectTriggerClasses, className)}
          onKeyDown={onTriggerKeyDown}
        >
          <span className={tSelectValueClasses}>{labels.length ? labels.join(', ') : placeholder}</span>
          <TIcon icon={ChevronDown} className={tSelectChevronClasses} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        {/* The list focuses its first selected row itself when it mounts. */}
        <Popover.Content
          data-slot="select-content"
          side="bottom"
          align="start"
          sideOffset={4}
          className={tSelectContentClasses}
          style={contentStyle}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <TTreeList
            id={treeId}
            options={options}
            index={index}
            expanded={expanded}
            selected={selected}
            multiple={multiple}
            onToggleExpanded={toggleExpanded}
            onSelect={select}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
          />
        </Popover.Content>
      </Popover.Portal>
      {/* Form submission and `required` validation, as TSelect's. Focusing it (an invalid form does) moves
          focus to the trigger. */}
      {name !== undefined && (
        <select
          multiple={multiple}
          aria-hidden
          tabIndex={-1}
          name={name}
          required={required}
          disabled={disabled}
          value={multiple ? shown : (shown[0] ?? '')}
          onChange={() => {}}
          onFocus={() => triggerRef.current?.focus()}
          className="sr-only"
        >
          {!multiple && <option value="" />}
          {[...index.values()].map(({ node }) => (
            <option key={node.value} value={node.value}>
              {node.label}
            </option>
          ))}
        </select>
      )}
    </Popover.Root>
  )
}
