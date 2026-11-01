import { type KeyboardEvent, type MouseEvent, useEffect, useRef, useState } from 'react'
import { tDateFieldSegmentClasses } from './TDateField.variants'
import {
  dateOf,
  emptyValues,
  type EditablePart,
  type HourCycle,
  is12Hour,
  isComplete,
  removeDigit,
  type SegmentDate,
  type SegmentValues,
  segmentAria,
  segmentsOf,
  stepSegment,
  type TimePart,
  type TypingState,
  typeDigit,
  valuesOf,
} from './segments'

const DATE_ATTR = 'data-reka-date-field-segment'
const TIME_ATTR = 'data-reka-time-field-segment'
const SEGMENTS = `[${DATE_ATTR}]:not([${DATE_ATTR}="literal"]),[${TIME_ATTR}]:not([${TIME_ATTR}="literal"])`

/** The editable segments of the field around `from` (its role="group" root), in order. */
function segmentsAround(from: Element) {
  return Array.from(from.closest('[role=group]')?.querySelectorAll<HTMLElement>(SEGMENTS) ?? [])
}

/** Focuses the field's first segment (an invalid form focuses its hidden input). */
export function focusFirstSegment(from: Element) {
  segmentsAround(from)[0]?.focus()
}

/**
 * The field root's keydown: Arrow Left/Right move between the segments (both dates' in a range field), as
 * Reka's DateField root does.
 */
export function onFieldKeyDown(event: KeyboardEvent<HTMLElement>) {
  if (event.nativeEvent.isComposing || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
  const segments = segmentsAround(event.target as Element)
  const index = segments.indexOf(event.target as HTMLElement)
  if (index < 0) return
  const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
  const forward = (event.key === 'ArrowRight') !== rtl
  segments[index + (forward ? 1 : -1)]?.focus()
}

const ACCEPTED = new Set(['Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', ' ', 'a', 'A', 'p', 'P'])
const isDigit = (key: string) => /^\d$/.test(key)

interface DateSegmentsProps {
  kind: 'date' | 'time'
  /** The complete value, undefined while the field is empty or incomplete. */
  value: SegmentDate | undefined
  /** Called once every segment is filled, and with undefined when one is cleared. */
  onValueChange: (value: SegmentDate | undefined) => void
  /** The date worked on while the field is empty: today (date), today at midnight (time). */
  fallback: SegmentDate
  locale: string
  granularity?: TimePart
  hourCycle?: HourCycle
  disabled?: boolean
  readonly?: boolean
  /** The value is out of range or unavailable (data-invalid and aria-invalid on each segment). */
  invalid?: boolean
  /** In a range field, which date these segments edit. */
  rangeType?: 'start' | 'end'
}

// One value's segments (a date's, or a time's), rendered inside a field root (role group) that handles
// Arrow Left/Right with onFieldKeyDown. Each segment is an editable span (role spinbutton) that takes its
// keys itself, as Reka's DateFieldInput / TimeFieldInput.
export function DateSegments({
  kind,
  value,
  onValueChange,
  fallback,
  locale,
  granularity = 'minute',
  hourCycle,
  disabled,
  readonly,
  invalid,
  rangeType,
}: DateSegmentsProps) {
  const [values, setValues] = useState<SegmentValues>(() =>
    value ? valuesOf(kind, value, granularity) : emptyValues(kind, granularity),
  )
  // The date the segments work on: the value, or the fallback until there is one.
  const [ref, setRef] = useState<SegmentDate>(value ?? fallback)
  const typing = useRef(new Map<EditablePart, TypingState>())
  const typingOf = (part: EditablePart) => {
    if (!typing.current.has(part)) typing.current.set(part, { lastKeyZero: false, hasLeftFocus: true })
    return typing.current.get(part)!
  }

  // A value from outside fills the segments; clearing it empties a complete field (a half-typed one stays).
  const valueKey = value?.toString()
  useEffect(() => {
    if (value) {
      setValues(valuesOf(kind, value, granularity))
      setRef(value)
    } else setValues((current) => (isComplete(current) ? emptyValues(kind, granularity) : current))
    // valueKey stands for value, a new object on every render.
  }, [valueKey, kind, granularity])

  const twelveHour = kind === 'time' && is12Hour(locale, hourCycle)
  const attr = kind === 'date' ? DATE_ATTR : TIME_ATTR

  function onKeyDown(part: EditablePart, event: KeyboardEvent<HTMLSpanElement>) {
    if (event.nativeEvent.isComposing || event.key === 'Process' || disabled || readonly) return
    if (event.key !== 'Tab') event.preventDefault()
    const { key } = event
    if (!ACCEPTED.has(key) && !isDigit(key)) return
    if (key === 'ArrowLeft' || key === 'ArrowRight') return

    let next = values
    let cleared = false
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      next = stepSegment(part, key === 'ArrowUp' ? 1 : -1, values, ref)
    } else if (part === 'dayPeriod') {
      const period = key === 'a' || key === 'A' ? 'AM' : key === 'p' || key === 'P' ? 'PM' : undefined
      if (period && period !== values.dayPeriod) next = stepSegment('dayPeriod', 1, values, ref)
    } else if (isDigit(key)) {
      const typed = typeDigit(part, Number(key), values, ref, typingOf(part), twelveHour)
      next = typed.values
      if (typed.moveToNext) {
        const segments = segmentsAround(event.currentTarget)
        segments[segments.indexOf(event.currentTarget) + 1]?.focus()
      }
    } else if (key === 'Backspace') {
      typingOf(part).hasLeftFocus = false
      const prev = values[part] ?? null
      next = { ...values, [part]: removeDigit(prev) }
      cleared = prev !== null && next[part] === null
    }
    if (next === values) return
    setValues(next)
    if (isComplete(next)) {
      const date = dateOf(next, ref)
      setRef(date)
      onValueChange(date)
    } else if (cleared) onValueChange(undefined)
  }

  return segmentsOf(kind, values, ref, locale, granularity, hourCycle).map((segment, i) => {
    if (segment.part === 'literal')
      return (
        <span
          key={i}
          aria-hidden
          data-segment="literal"
          {...{ [attr]: 'literal' }}
          data-reka-date-range-field-segment-type={rangeType}
          className={tDateFieldSegmentClasses}
        >
          {segment.text}
        </span>
      )
    const part = segment.part
    const { inputMode, ...aria } = segmentAria(part, values, ref, locale, hourCycle)
    return (
      <span
        key={i}
        role="spinbutton"
        contentEditable={!disabled && !readonly}
        suppressContentEditableWarning
        tabIndex={disabled ? undefined : 0}
        spellCheck={false}
        inputMode={inputMode}
        autoCorrect="off"
        enterKeyHint="next"
        {...aria}
        {...{ [attr]: part }}
        data-reka-date-range-field-segment-type={rangeType}
        aria-disabled={disabled || undefined}
        aria-readonly={readonly || undefined}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        aria-invalid={invalid || undefined}
        className={tDateFieldSegmentClasses}
        onKeyDown={(event) => onKeyDown(part, event)}
        onMouseDown={(event: MouseEvent) => disabled && event.preventDefault()}
        onBlur={() => {
          typingOf(part).hasLeftFocus = true
        }}
        onPaste={(event) => event.preventDefault()}
        onDrop={(event) => event.preventDefault()}
      >
        {segment.text}
      </span>
    )
  })
}
