import type { PrimitiveProps } from 'reka-ui'

export interface TAccordionProps extends PrimitiveProps {
  /** One section open at a time (single), or several (multiple). v-model is a string or an array to match. */
  type: 'single' | 'multiple'
  /** With type="single": clicking the open section closes it. */
  collapsible?: boolean
  /** The open section(s) when no v-model is bound. */
  defaultValue?: string | string[]
  /** Prevents toggling every section. */
  disabled?: boolean
}

export interface TAccordionItemProps extends PrimitiveProps {
  /** Identifies the section in the accordion's value. */
  value: string
  disabled?: boolean
}

export interface TAccordionTriggerProps extends PrimitiveProps {}
export interface TAccordionContentProps extends PrimitiveProps {}
