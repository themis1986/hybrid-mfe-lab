import type { PrimitiveProps } from 'reka-ui'

export interface TSliderProps extends PrimitiveProps {
  /** Thumb and track size. */
  size?: 'sm' | 'md'
  /** Initial values when no v-model is bound: one entry per thumb. */
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  /** With several thumbs: how many steps apart they must stay. */
  minStepsBetweenThumbs?: number
  orientation?: 'horizontal' | 'vertical'
  /** Prevents interaction. */
  disabled?: boolean
  /** Field name, submitted with an owning form. */
  name?: string
  /** Names each thumb for assistive technology: one string for all, or one per thumb. */
  thumbLabel?: string | string[]
}
