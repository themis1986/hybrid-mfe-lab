import type { PrimitiveProps } from 'reka-ui'

export interface TButtonProps extends PrimitiveProps {
  /** Visual emphasis. */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'danger'
  /** Height and padding. */
  size?: 'sm' | 'md' | 'lg'
  /** Text content, when the default slot is empty. */
  label?: string
}
