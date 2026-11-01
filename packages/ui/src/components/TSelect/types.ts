export interface TSelectOption {
  value: string
  /** Shown in the list, and in the trigger while selected. */
  label: string
  disabled?: boolean
}

interface TSelectBaseProps {
  options: TSelectOption[]
  /** Shown in the trigger while nothing is selected. */
  placeholder?: string
  /** Trigger height and padding, as TInput's. */
  size?: 'sm' | 'md' | 'lg'
  /** Marks the select as invalid (`aria-invalid` + error border). */
  invalid?: boolean
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** A value must be selected before the owning form submits. */
  required?: boolean
  /** The trigger's id, for a <label htmlFor>. */
  id?: string
  /** Merged onto the trigger. */
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export interface TSelectSingleProps extends TSelectBaseProps {
  multiple?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface TSelectMultipleProps extends TSelectBaseProps {
  /** Several options can be selected; the list stays open while they are toggled. */
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type TSelectProps = TSelectSingleProps | TSelectMultipleProps
