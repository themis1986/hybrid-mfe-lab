import type { TComboboxOption } from '../../lib/combobox'

export type { TComboboxOption }

interface TComboboxBaseProps {
  options: TComboboxOption[]
  /** Shown in the empty field. */
  placeholder?: string
  /** Field height and text size, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Marks the combobox as invalid (`aria-invalid` + error border). */
  invalid?: boolean
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** A value must be selected before the owning form submits. */
  required?: boolean
  /** Shown in the list when no option matches the typed text. */
  emptyText?: string
  /** A chip's remove button is named "<removeLabel> <option label>". */
  removeLabel?: string
  /** The input's id, for a <label htmlFor>. */
  id?: string
  /** Merged onto the field (the box around the input). */
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export interface TComboboxSingleProps extends TComboboxBaseProps {
  multiple?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface TComboboxMultipleProps extends TComboboxBaseProps {
  /** Several options can be selected, shown as chips; the list stays open while they are toggled. */
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type TComboboxProps = TComboboxSingleProps | TComboboxMultipleProps
