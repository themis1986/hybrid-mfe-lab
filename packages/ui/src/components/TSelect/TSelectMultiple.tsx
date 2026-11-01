import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown } from 'lucide-react'
import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { cn } from '../../lib/cn'
import {
  tCheckboxIconClasses,
  tCheckboxIndicatorClasses,
  tCheckboxVariants,
} from '../TCheckbox/TCheckbox.variants'
import { TIcon } from '../TIcon'
import { tInputVariants } from '../TInput/TInput.variants'
import {
  tSelectChevronClasses,
  tSelectContentClasses,
  tSelectIndicatorClasses,
  tSelectItemClasses,
  tSelectTriggerClasses,
  tSelectValueClasses,
  tSelectViewportClasses,
} from './TSelect.variants'
import type { TSelectMultipleProps, TSelectOption } from './types'

const contentStyle = {
  '--t-select-trigger-width': 'var(--radix-popover-trigger-width)',
  '--t-select-available-height':
    'var(--radix-popover-content-available-height)',
} as CSSProperties

const TYPEAHEAD_RESET_MS = 500

// TSelect's multiple mode. Radix Select holds one value, so this is a listbox in a Radix Popover, written to
// behave like Reka's multiple select (the Vue library's TSelect):
// - the trigger is a combobox button; ArrowDown/ArrowUp, Enter and Space open the list;
// - focus stays on the listbox and `aria-activedescendant` points at the highlighted option;
// - ArrowUp/ArrowDown/Home/End move the highlight, Space/Enter toggle it and keep the list open, typing
//   jumps to a matching label, Tab is held, and Escape (handled by Popover) closes and refocuses the trigger;
// - the options carry the data attributes Radix and Reka set on theirs, so the shared item classes apply.
export function TSelectMultiple({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder,
  size,
  invalid,
  disabled,
  name,
  required,
  id,
  className,
  multiple: _multiple,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: TSelectMultipleProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = valueProp ?? uncontrolledValue
  const [open, setOpen] = useState(false)
  // Index into `options`; -1 while nothing is highlighted.
  const [highlighted, setHighlighted] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxRef = useRef<HTMLDivElement>(null)
  const typeahead = useRef({ text: '', timer: 0 })
  const baseId = useId()
  const listboxId = `${baseId}-listbox`
  const optionId = (index: number) => `${baseId}-option-${index}`

  // In selection order, as Reka's trigger shows them.
  const selectedLabels = value.flatMap(
    (v) => options.find((option) => option.value === v)?.label ?? [],
  )

  useEffect(() => {
    if (open && highlighted >= 0) {
      document
        .getElementById(optionId(highlighted))
        ?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, highlighted])

  function toggle(option: TSelectOption) {
    if (option.disabled) return
    const next = value.includes(option.value)
      ? value.filter((v) => v !== option.value)
      : [...value, option.value]
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  // The next enabled option from `from` in direction `step`, or `from` itself at the end of the list.
  function step(from: number, direction: 1 | -1) {
    for (
      let i = from + direction;
      i >= 0 && i < options.length;
      i += direction
    ) {
      if (!options[i].disabled) return i
    }
    return from
  }

  // Jumps to the next label that starts with the typed text. A single repeated key cycles through the
  // labels that start with it.
  function search(key: string) {
    const state = typeahead.current
    window.clearTimeout(state.timer)
    state.text += key.toLowerCase()
    state.timer = window.setTimeout(() => (state.text = ''), TYPEAHEAD_RESET_MS)

    const start =
      state.text.length === 1 ? highlighted + 1 : Math.max(highlighted, 0)
    for (let n = 0; n < options.length; n++) {
      const index = (start + n) % options.length
      const option = options[index]
      if (
        !option.disabled &&
        option.label.toLowerCase().startsWith(state.text)
      ) {
        setHighlighted(index)
        return
      }
    }
  }

  function onTriggerKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
    }
  }

  function onListboxKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        setHighlighted((i) => step(i, 1))
        break
      case 'ArrowUp':
        setHighlighted((i) => step(i, -1))
        break
      case 'Home':
        setHighlighted(step(-1, 1))
        break
      case 'End':
        setHighlighted(step(options.length, -1))
        break
      case 'Tab':
        break
      case ' ':
      case 'Enter':
        // A space in the middle of typing is part of the label being searched.
        if (event.key === ' ' && typeahead.current.text) search(' ')
        else if (options[highlighted]) toggle(options[highlighted])
        break
      default:
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        )
          return
        search(event.key)
    }
    event.preventDefault()
  }

  // Opening highlights the first selected option (or the first enabled one) and focuses the listbox.
  function onOpenAutoFocus(event: Event) {
    event.preventDefault()
    const firstSelected = options.findIndex(
      (option) => !option.disabled && value.includes(option.value),
    )
    setHighlighted(firstSelected >= 0 ? firstSelected : step(-1, 1))
    listboxRef.current?.focus()
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          data-slot="select-trigger"
          id={id}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={invalid || undefined}
          data-placeholder={selectedLabels.length ? undefined : ''}
          disabled={disabled}
          className={cn(
            tInputVariants({ size }),
            tSelectTriggerClasses,
            className,
          )}
          onKeyDown={onTriggerKeyDown}
        >
          <span className={tSelectValueClasses}>
            {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
          </span>
          <TIcon icon={ChevronDown} className={tSelectChevronClasses} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          data-slot="select-content"
          side="bottom"
          align="start"
          sideOffset={4}
          className={tSelectContentClasses}
          style={contentStyle}
          onOpenAutoFocus={onOpenAutoFocus}
        >
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-activedescendant={
              highlighted >= 0 ? optionId(highlighted) : undefined
            }
            tabIndex={0}
            className={tSelectViewportClasses}
            onKeyDown={onListboxKeyDown}
            onPointerLeave={() => setHighlighted(-1)}
          >
            {options.map((option, index) => {
              const selected = value.includes(option.value)

              return (
                <div
                  key={option.value}
                  id={optionId(index)}
                  data-slot="select-item"
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled || undefined}
                  data-state={selected ? 'checked' : 'unchecked'}
                  data-highlighted={index === highlighted ? '' : undefined}
                  data-disabled={option.disabled ? '' : undefined}
                  className={tSelectItemClasses}
                  onPointerMove={() =>
                    !option.disabled && setHighlighted(index)
                  }
                  onClick={() => toggle(option)}
                >
                  <span
                    aria-hidden
                    className={cn(
                      tCheckboxVariants({ size: 'sm' }),
                      tSelectIndicatorClasses,
                    )}
                  >
                    {selected && (
                      <span className={tCheckboxIndicatorClasses}>
                        <TIcon icon={Check} className={tCheckboxIconClasses} />
                      </span>
                    )}
                  </span>
                  {option.label}
                </div>
              )
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
      {/* Form submission and `required` validation, as Radix and Reka's hidden native select. Focusing it
          (an invalid form does) moves focus to the trigger. */}
      {name !== undefined && (
        <select
          multiple
          aria-hidden
          tabIndex={-1}
          name={name}
          required={required}
          disabled={disabled}
          value={value}
          onChange={() => {}}
          onFocus={() => triggerRef.current?.focus()}
          className="sr-only"
        >
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
