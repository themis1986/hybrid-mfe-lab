import type { PrimitiveProps } from 'reka-ui'

export interface TTabsProps extends PrimitiveProps {
  /** The tab selected when no v-model is bound. */
  defaultValue?: string
  orientation?: 'horizontal' | 'vertical'
  /** automatic: a focused tab is selected; manual: Enter or Space selects it. */
  activationMode?: 'automatic' | 'manual'
}

export interface TTabsListProps extends PrimitiveProps {
  /** An underline under the selected tab (line), or raised chips (pills). */
  variant?: 'line' | 'pills'
}

export interface TTabsTriggerProps extends PrimitiveProps {
  /** Pairs the tab with the TTabsContent of the same value. */
  value: string
  disabled?: boolean
}

export interface TTabsContentProps extends PrimitiveProps {
  value: string
}
