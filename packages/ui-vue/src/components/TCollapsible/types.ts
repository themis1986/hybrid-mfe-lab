import type { PrimitiveProps } from 'reka-ui'

export interface TCollapsibleProps extends PrimitiveProps {
  /** Open when first rendered, when no v-model:open is bound. */
  defaultOpen?: boolean
  /** Prevents toggling. */
  disabled?: boolean
}

export interface TCollapsibleTriggerProps extends PrimitiveProps {}
export interface TCollapsibleContentProps extends PrimitiveProps {}
