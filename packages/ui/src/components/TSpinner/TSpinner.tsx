import { cn } from '../../lib/cn'
import { tSpinnerSvgClasses, tSpinnerTrackClasses, tSpinnerVariants } from './TSpinner.variants'
import type { TSpinnerProps } from './types'

// A loading indicator. The label sits in a role="status" region as visually hidden text, which screen
// readers announce more reliably than an aria-label. Pass aria-hidden when visible text nearby already
// says what is loading.
export function TSpinner({ size, label = 'Loading', className, ...props }: TSpinnerProps) {
  return (
    <span role="status" data-slot="spinner" className={cn(tSpinnerVariants({ size }), className)} {...props}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={tSpinnerSvgClasses}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className={tSpinnerTrackClasses} />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  )
}
