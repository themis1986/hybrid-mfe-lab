import * as Progress from '@radix-ui/react-progress'
import { cn } from '../../lib/cn'
import {
  tProgressIndicatorVariants,
  tProgressVariants,
} from './TProgress.variants'
import type { TProgressProps } from './types'

// A progress bar (Radix Progress): `value` out of `max` (100); null or no value is indeterminate. Name it
// with `aria-label`, and `getValueLabel` for a spoken value other than the percentage.
export function TProgress({
  value,
  max = 100,
  size,
  tone,
  className,
  ...props
}: TProgressProps) {
  const percent =
    value == null ? undefined : Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <Progress.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn(tProgressVariants({ size }), className)}
      {...props}
    >
      <Progress.Indicator
        data-slot="progress-indicator"
        className={tProgressIndicatorVariants({ tone })}
        style={
          percent === undefined
            ? undefined
            : { translate: `${percent - 100}% 0` }
        }
      />
    </Progress.Root>
  )
}
