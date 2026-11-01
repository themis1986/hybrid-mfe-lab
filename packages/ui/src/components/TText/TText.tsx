import * as Label from '@radix-ui/react-label'
import { useId, useState } from 'react'
import { cn } from '../../lib/cn'
import {
  tFieldHintVariants,
  tFieldLabelClasses,
  tFieldRootClasses,
} from '../TField/TField.variants'
import { tInputVariants } from '../TInput/TInput.variants'
import {
  tTextAreaVariants,
  tTextCounterClasses,
  tTextHintRowClasses,
} from './TText.variants'
import type { TTextProps } from './types'

// The textarea's padding (py-2) plus its border, around a number of lines.
const rowsHeight = (rows: number) => `calc(${rows}lh + 1rem + 2px)`

// A labelled multi-line text field: TField's layout around a textarea with TInput's look. With
// `maxLength`, a character count sits under it. `className` and `style` go on the root; every other prop
// goes on the textarea.
export function TText({
  label,
  description,
  error,
  id,
  size,
  rows = 3,
  autoResize = false,
  maxRows,
  maxLength,
  value,
  defaultValue,
  onChange,
  className,
  style,
  ...props
}: TTextProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const hintId = `${textareaId}-hint`
  const counterId = `${textareaId}-counter`
  const hint = error ?? description
  // The count follows `value` when controlled, the textarea's own value otherwise.
  const [ownLength, setOwnLength] = useState(
    () => String(defaultValue ?? '').length,
  )
  const length = value !== undefined ? String(value).length : ownLength
  const describedBy = [hint && hintId, maxLength !== undefined && counterId]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cn(tFieldRootClasses, className)} style={style}>
      <Label.Root htmlFor={textareaId} className={tFieldLabelClasses}>
        {label}
      </Label.Root>
      <textarea
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          tInputVariants({ size }),
          tTextAreaVariants({ autoResize }),
        )}
        style={
          autoResize
            ? {
                minHeight: rowsHeight(rows),
                maxHeight: maxRows ? rowsHeight(maxRows) : undefined,
              }
            : undefined
        }
        onChange={(event) => {
          if (value === undefined) setOwnLength(event.target.value.length)
          onChange?.(event)
        }}
        {...props}
      />
      {(hint || maxLength !== undefined) && (
        <div className={tTextHintRowClasses}>
          {hint && (
            <p
              id={hintId}
              role={error ? 'alert' : undefined}
              className={tFieldHintVariants({
                tone: error ? 'error' : 'description',
              })}
            >
              {hint}
            </p>
          )}
          {maxLength !== undefined && (
            <p id={counterId} className={tTextCounterClasses}>
              {length} / {maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
