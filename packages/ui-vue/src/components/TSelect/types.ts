export interface TSelectOption {
  value: string
  /** Shown in the list, and in the trigger while selected. */
  label: string
  disabled?: boolean
}

export interface TSelectProps {
  options: TSelectOption[]
  /** Several options can be selected (v-model is then an array); the list stays open while they are toggled. */
  multiple?: boolean
  /** Initial value when no v-model is bound: a string, or an array with `multiple`. */
  defaultValue?: string | string[]
  /** Shown in the trigger while nothing is selected. */
  placeholder?: string
  /** Trigger height and padding, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Marks the select as invalid (`aria-invalid` + error border). */
  invalid?: boolean
  /** Prevents interaction (native `disabled`). */
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** A value must be selected before the owning form submits. */
  required?: boolean
}
