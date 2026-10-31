import type { PrimitiveProps } from 'reka-ui'

export interface TSwitchProps extends PrimitiveProps {
  /** Track and thumb size. */
  size?: 'sm' | 'md'
  /** Initial state when no v-model is bound. */
  defaultValue?: boolean
  /** Prevents interaction (native `disabled`). */
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** Value submitted with the name while on. */
  value?: string
  /** Must be on before the owning form submits. */
  required?: boolean
}
