import * as Label from '@radix-ui/react-label'
import { useId } from 'react'
import { cn } from '../../lib/cn'
import {
  tFormFieldHintVariants,
  tFormFieldLabelClasses,
  tFormFieldRootClasses,
} from './TFormField.variants'
import type { TFormFieldProps } from './types'

// A label and a hint around any control: what TField does for an input, for a select, a date picker, a
// radio group or a combobox. The control is a render function, so the field can hand it the ids to wire.
// Not bridged as a custom element: its content is a React function.
export function TFormField({
  label,
  description,
  error,
  id,
  className,
  children,
  ...props
}: TFormFieldProps) {
  const generatedId = useId()
  const controlId = id ?? `t-form-field-${generatedId}`
  const labelId = `${controlId}-label`
  const hintId = `${controlId}-hint`
  const hint = error ?? description

  return (
    <div className={cn(tFormFieldRootClasses, className)} {...props}>
      <Label.Root
        id={labelId}
        htmlFor={controlId}
        className={tFormFieldLabelClasses}
      >
        {label}
      </Label.Root>
      {children({
        id: controlId,
        labelId,
        describedBy: hint ? hintId : undefined,
        invalid: !!error,
      })}
      {hint && (
        <p
          id={hintId}
          role={error ? 'alert' : undefined}
          className={tFormFieldHintVariants({
            tone: error ? 'error' : 'description',
          })}
        >
          {hint}
        </p>
      )}
    </div>
  )
}
