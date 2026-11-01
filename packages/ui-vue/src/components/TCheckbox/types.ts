import type { PrimitiveProps } from 'reka-ui'

export interface TCheckboxProps extends PrimitiveProps {
  /** Box size. */
  size?: 'sm' | 'md'
  /** Initial state when no v-model is bound. */
  defaultValue?: boolean | 'indeterminate'
  /** Prevents interaction (native `disabled`). */
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** Value submitted with the name while checked. */
  value?: string
  /** Must be checked before the owning form submits. */
  required?: boolean
}
