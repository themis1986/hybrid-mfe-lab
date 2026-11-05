import { ChevronLeft, ChevronRight } from '@repo/ui/icons'
import { formatMonth } from '../../lib/dates'
import { IconButton } from '../common/IconButton'

/** The month the budgets page shows, with buttons to the one before and after. */
export function MonthStepper({
  month,
  canGoForward,
  onPrevious,
  onNext,
}: {
  month: string
  canGoForward: boolean
  onPrevious(): void
  onNext(): void
}) {
  return (
    <div className="flex items-center gap-1">
      <IconButton icon={ChevronLeft} label="Previous month" onClick={onPrevious} />
      {/* Announced when it changes, since the buttons keep the focus. */}
      <h2
        aria-live="polite"
        className="m-0 min-w-36 text-center text-base font-semibold text-fg"
      >
        {formatMonth(month)}
      </h2>
      <IconButton
        icon={ChevronRight}
        label="Next month"
        disabled={!canGoForward}
        onClick={onNext}
      />
    </div>
  )
}
