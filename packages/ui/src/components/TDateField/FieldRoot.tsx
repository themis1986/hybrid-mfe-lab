import type { ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { focusFirstSegment, onFieldKeyDown } from './DateSegments'
import { tDateFieldVariants } from './TDateField.variants'
import type { TSegmentedFieldProps } from './types'

interface FieldRootProps extends Omit<TSegmentedFieldProps, 'locale'> {
  ref?: Ref<HTMLDivElement>
  slot: string
  /** The value is out of range or unavailable (data-invalid, as Reka's root). */
  outOfRange?: boolean
  /** What the hidden input submits. */
  submitValue: string
  children: ReactNode
}

// A segmented field's root, as Reka's DateField root: a role="group" box (TDateField's look) that moves focus
// between the segments with Arrow Left/Right, and a hidden input that carries `id`, the form value and
// `required`. Focusing that input (a <label htmlFor>, an invalid form) focuses the first segment.
export function FieldRoot({
  ref,
  slot,
  size,
  invalid,
  outOfRange,
  disabled,
  readonly,
  name,
  required,
  id,
  submitValue,
  className,
  children,
  ...aria
}: FieldRootProps) {
  return (
    <div
      ref={ref}
      role="group"
      data-slot={slot}
      {...aria}
      aria-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readonly ? '' : undefined}
      data-invalid={outOfRange ? '' : undefined}
      className={cn(tDateFieldVariants({ size }), className)}
      onKeyDown={onFieldKeyDown}
    >
      {children}
      {(name !== undefined || id !== undefined) && (
        <input
          aria-hidden
          tabIndex={-1}
          id={id}
          name={name}
          value={submitValue}
          required={required}
          disabled={disabled}
          className="sr-only"
          onChange={() => {}}
          onFocus={(event) => focusFirstSegment(event.currentTarget)}
        />
      )}
    </div>
  )
}
