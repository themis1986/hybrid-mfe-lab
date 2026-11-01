import type { PrimitiveProps } from 'reka-ui'

export interface TRadioGroupProps extends PrimitiveProps {
  /** Layout and arrow keys (vertical by default). */
  orientation?: 'vertical' | 'horizontal'
  /** Initial value when no v-model is bound. */
  defaultValue?: string
  /** Prevents interaction with every item. */
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** An item must be checked before the owning form submits. */
  required?: boolean
}

export interface TRadioGroupItemProps extends PrimitiveProps {
  /** The group's value while this item is checked. */
  value: string
  /** Circle size. */
  size?: 'sm' | 'md'
  /** Prevents interaction with this item. */
  disabled?: boolean
}
