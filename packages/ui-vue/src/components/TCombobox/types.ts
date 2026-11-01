import type { TComboboxOption } from '../../lib/combobox'

export type { TComboboxOption }

export interface TComboboxProps {
  options: TComboboxOption[]
  /** Several options can be selected (v-model is then an array), shown as chips; the list stays open while they are toggled. */
  multiple?: boolean
  /** Initial value when no v-model is bound: a string, or an array with `multiple`. */
  defaultValue?: string | string[]
  /** Shown in the empty field. */
  placeholder?: string
  /** Field height and text size, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Marks the combobox as invalid (`aria-invalid` + error border). */
  invalid?: boolean
  /** Prevents interaction (native `disabled`). */
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** A value must be selected before the owning form submits. */
  required?: boolean
  /** Shown in the list when no option matches the typed text. */
  emptyText?: string
  /** A chip's remove button is named "<removeLabel> <option label>". */
  removeLabel?: string
}
