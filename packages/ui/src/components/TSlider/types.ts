import type * as Slider from '@radix-ui/react-slider'
import type { ComponentProps } from 'react'

export interface TSliderProps extends ComponentProps<typeof Slider.Root> {
  /** Thumb and track size. */
  size?: 'sm' | 'md'
  /** Names each thumb for assistive technology: one string for all, or one per thumb. */
  thumbLabel?: string | string[]
}
