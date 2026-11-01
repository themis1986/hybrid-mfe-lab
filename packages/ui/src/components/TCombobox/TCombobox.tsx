import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown, X } from 'lucide-react'
import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { cn } from '../../lib/cn'
import { filterOptions, type TComboboxOption } from '../../lib/combobox'
import { tCheckboxIconClasses, tCheckboxIndicatorClasses, tCheckboxVariants } from '../TCheckbox/TCheckbox.variants'
import { TIcon } from '../TIcon'
import { tRadioIndicatorClasses, tRadioVariants } from '../TRadioGroup/TRadioGroup.variants'
import {
  tSelectChevronClasses,
  tSelectContentClasses,
  tSelectIndicatorClasses,
  tSelectItemClasses,
  tSelectViewportClasses,
} from '../TSelect/TSelect.variants'
import {
  tComboboxChipClasses,
  tComboboxChipIconClasses,
  tComboboxChipLabelClasses,
  tComboboxChipRemoveClasses,
  tComboboxEmptyClasses,
  tComboboxFieldVariants,
  tComboboxInputClasses,
  tComboboxToggleClasses,
  tComboboxValuesClasses,
} from './TCombobox.variants'
import type { TComboboxProps } from './types'

const contentStyle = {
  '--t-select-trigger-width': 'var(--radix-popover-trigger-width)',
  '--t-select-available-height': 'var(--radix-popover-content-available-height)',
} as CSSProperties

const toArray = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

const firstEnabled = (options: TComboboxOption[]) => options.find((option) => !option.disabled)?.value

// A text field that filters `options` as you type, selecting one value or, with `multiple`, several (shown
// as chips). Radix has no combobox, so this is an input anchoring a Radix Popover, written to behave like
// Reka's Combobox (the Vue library's TCombobox):
// - the input is the combobox and keeps focus; `aria-activedescendant` points at the highlighted option;
// - typing opens the list, filters it (lib/combobox.ts) and highlights the first match; ArrowDown/ArrowUp
//   open it, then move the highlight with Home/End; Enter or a click selects;
// - single closes on selection and the input shows the selected label again whenever the list closes;
//   multiple toggles, stays open and clears the typed text; Backspace in the empty input removes the last chip;
// - Escape (handled by Popover), Tab or a click outside closes. Name it with `aria-label` or a
//   <label htmlFor> pointing at `id`.
export function TCombobox(props: TComboboxProps) {
  const {
    options,
    multiple = false,
    placeholder,
    size,
    invalid,
    disabled,
    name,
    required,
    emptyText = 'No results',
    removeLabel = 'Remove',
    id,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
  } = props
  const [uncontrolledValue, setUncontrolledValue] = useState(() => toArray(props.defaultValue))
  const selected = props.value !== undefined ? toArray(props.value) : uncontrolledValue
  const [open, setOpen] = useState(false)
  // The text that filters the list: what was typed since the list last opened or closed.
  const [query, setQuery] = useState('')
  const labelOf = (value: string | undefined) => options.find((option) => option.value === value)?.label
  const selectedLabel = multiple ? '' : (labelOf(selected[0]) ?? '')
  const [inputValue, setInputValue] = useState(selectedLabel)
  const [highlighted, setHighlighted] = useState<string>()
  const fieldRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const baseId = useId()
  const listboxId = `${baseId}-listbox`
  const optionId = (value: string) => `${baseId}-option-${options.findIndex((option) => option.value === value)}`

  const filtered = filterOptions(options, query)
  const enabled = filtered.filter((option) => !option.disabled)
  const activeId = open && highlighted !== undefined && filtered.some((o) => o.value === highlighted) ? optionId(highlighted) : undefined

  // While the list is closed the input shows the selection: its label (single) or nothing (multiple).
  useEffect(() => {
    if (!open) setInputValue(selectedLabel)
  }, [open, selectedLabel])

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' })
  }, [activeId])

  function commit(next: string[]) {
    if (props.value === undefined) setUncontrolledValue(next)
    if (props.multiple) props.onValueChange?.(next)
    else props.onValueChange?.(next[0])
  }

  // Opening and closing both clear the filter. Opening highlights the first selected option, or the first one.
  function setOpenState(next: boolean) {
    if (next && disabled) return
    setOpen(next)
    setQuery('')
    if (next) {
      setHighlighted(options.find((o) => !o.disabled && selected.includes(o.value))?.value ?? firstEnabled(options))
      inputRef.current?.focus()
    }
  }

  function choose(option: TComboboxOption) {
    if (option.disabled) return
    if (multiple) {
      commit(selected.includes(option.value) ? selected.filter((v) => v !== option.value) : [...selected, option.value])
      setInputValue('')
      setQuery('')
    } else {
      commit([option.value])
      setOpenState(false)
    }
  }

  function remove(value: string) {
    commit(selected.filter((v) => v !== value))
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value
    if (!open) setOpenState(true)
    setInputValue(text)
    setQuery(text)
    setHighlighted(firstEnabled(filterOptions(options, text)))
  }

  // The enabled option `direction` steps from the highlighted one, staying at the ends; from none, the
  // first (down) or the last (up).
  function move(direction: 1 | -1) {
    const index = enabled.findIndex((option) => option.value === highlighted)
    const next = index < 0 ? (direction > 0 ? 0 : enabled.length - 1) : Math.min(Math.max(index + direction, 0), enabled.length - 1)
    setHighlighted(enabled[next]?.value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (!open) setOpenState(true)
        else move(event.key === 'ArrowDown' ? 1 : -1)
        break
      case 'Home':
      case 'End':
        if (!open) return
        event.preventDefault()
        setHighlighted((event.key === 'Home' ? enabled[0] : enabled.at(-1))?.value)
        break
      case 'Enter': {
        const option = open ? filtered.find((o) => o.value === highlighted) : undefined
        if (!option || event.ctrlKey || event.metaKey || event.altKey) return
        event.preventDefault()
        choose(option)
        break
      }
      case 'Backspace':
        if (multiple && inputValue === '' && selected.length) {
          event.preventDefault()
          remove(selected[selected.length - 1])
        }
        break
    }
  }

  // Tab, or anything else that moves focus out of the field and the list, closes it.
  function onBlur(event: FocusEvent) {
    const next = event.relatedTarget as Node | null
    if (open && next && !fieldRef.current?.contains(next) && !contentRef.current?.contains(next)) setOpenState(false)
  }

  // A click on the field outside the input focuses the input and opens the list; its buttons keep focus there.
  function onFieldMouseDown(event: MouseEvent) {
    if (event.target !== inputRef.current) event.preventDefault()
  }

  function onFieldClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('button')) return
    inputRef.current?.focus()
    if (!open) setOpenState(true)
  }

  return (
    <Popover.Root open={open} onOpenChange={(next) => !next && setOpenState(false)}>
      <Popover.Anchor asChild>
        <div
          ref={fieldRef}
          data-slot="combobox-field"
          data-state={open ? 'open' : 'closed'}
          className={cn(tComboboxFieldVariants({ size }), className)}
          onMouseDown={onFieldMouseDown}
          onClick={onFieldClick}
        >
          <div data-slot="combobox-values" className={tComboboxValuesClasses}>
            {multiple &&
              selected.map((value) => {
                const label = labelOf(value)
                if (label === undefined) return null
                return (
                  <span key={value} data-slot="combobox-chip" className={tComboboxChipClasses}>
                    <span className={tComboboxChipLabelClasses}>{label}</span>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={`${removeLabel} ${label}`}
                      disabled={disabled}
                      className={tComboboxChipRemoveClasses}
                      onClick={() => remove(value)}
                    >
                      <TIcon icon={X} className={tComboboxChipIconClasses} />
                    </button>
                  </span>
                )
              })}
            <input
              ref={inputRef}
              id={id}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={open ? listboxId : undefined}
              aria-activedescendant={activeId}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              aria-describedby={ariaDescribedby}
              aria-invalid={invalid || undefined}
              placeholder={multiple && selected.length ? undefined : placeholder}
              disabled={disabled}
              value={inputValue}
              className={tComboboxInputClasses}
              onChange={onInput}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
            />
          </div>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Show options"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listboxId : undefined}
            disabled={disabled}
            className={tComboboxToggleClasses}
            onClick={() => setOpenState(!open)}
          >
            <TIcon icon={ChevronDown} className={tSelectChevronClasses} />
          </button>
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        {/* The content is the listbox itself, as Reka's (role and id replace Radix's dialog ones). */}
        <Popover.Content
          ref={contentRef}
          id={listboxId}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          data-slot="combobox-content"
          side="bottom"
          align="start"
          sideOffset={4}
          className={tSelectContentClasses}
          style={contentStyle}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          // The field anchors the list; pressing on it isn't "outside".
          onInteractOutside={(event) => {
            if (fieldRef.current?.contains(event.target as Node)) event.preventDefault()
          }}
          // Pressing an option keeps focus in the input.
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className={tSelectViewportClasses} onPointerLeave={() => setHighlighted(undefined)}>
            {filtered.length === 0 && <div className={tComboboxEmptyClasses}>{emptyText}</div>}
            {filtered.map((option) => {
              const isSelected = selected.includes(option.value)

              return (
                <div
                  key={option.value}
                  id={optionId(option.value)}
                  data-slot="combobox-item"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  data-state={isSelected ? 'checked' : 'unchecked'}
                  data-highlighted={option.value === highlighted ? '' : undefined}
                  data-disabled={option.disabled ? '' : undefined}
                  className={tSelectItemClasses}
                  onPointerMove={() => !option.disabled && setHighlighted(option.value)}
                  onClick={() => choose(option)}
                >
                  {multiple ? (
                    <span aria-hidden className={cn(tCheckboxVariants({ size: 'sm' }), tSelectIndicatorClasses)}>
                      {isSelected && (
                        <span className={tCheckboxIndicatorClasses}>
                          <TIcon icon={Check} className={tCheckboxIconClasses} />
                        </span>
                      )}
                    </span>
                  ) : (
                    <span aria-hidden className={cn(tRadioVariants({ size: 'sm' }), tSelectIndicatorClasses)}>
                      {isSelected && <span className={tRadioIndicatorClasses} />}
                    </span>
                  )}
                  {option.label}
                </div>
              )
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
      {/* Form submission and `required` validation, as TSelect's hidden native select. Focusing it (an
          invalid form does) moves focus to the input. */}
      {name !== undefined && (
        <select
          multiple={multiple}
          aria-hidden
          tabIndex={-1}
          name={name}
          required={required}
          disabled={disabled}
          value={multiple ? selected : (selected[0] ?? '')}
          onChange={() => {}}
          onFocus={() => inputRef.current?.focus()}
          className="sr-only"
        >
          {!multiple && <option value="" />}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Popover.Root>
  )
}
