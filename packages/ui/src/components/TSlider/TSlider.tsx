import * as Slider from '@radix-ui/react-slider'
import { cn } from '../../lib/cn'
import {
  tSliderClasses,
  tSliderRangeClasses,
  tSliderThumbVariants,
  tSliderTrackVariants,
} from './TSlider.variants'
import type { TSliderProps } from './types'

// A slider (Radix Slider): `value` + `onValueChange`, or `defaultValue`, as number arrays. One entry per
// thumb: [50] is a single value, [20, 80] a range. Name the thumbs with `thumbLabel`.
export function TSlider({
  size,
  thumbLabel,
  className,
  ...props
}: TSliderProps) {
  const thumbs = (props.value ?? props.defaultValue ?? [props.min ?? 0]).length

  return (
    <Slider.Root
      data-slot="slider"
      className={cn(tSliderClasses, className)}
      {...props}
    >
      <Slider.Track
        data-slot="slider-track"
        className={tSliderTrackVariants({ size })}
      >
        <Slider.Range
          data-slot="slider-range"
          className={tSliderRangeClasses}
        />
      </Slider.Track>
      {Array.from({ length: thumbs }, (_, i) => (
        <Slider.Thumb
          key={i}
          data-slot="slider-thumb"
          aria-label={Array.isArray(thumbLabel) ? thumbLabel[i] : thumbLabel}
          className={tSliderThumbVariants({ size })}
        />
      ))}
    </Slider.Root>
  )
}
