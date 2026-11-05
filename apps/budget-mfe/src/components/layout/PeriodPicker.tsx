import { TRangeDatePicker } from '@repo/ui'
import { usePeriod } from '../../hooks/usePeriod'
import { LIMITS, latestDate } from '../../lib/schemas'

/** The period every page shows: a range with presets. */
export function PeriodPicker() {
  const { period, presets, setPeriod } = usePeriod()
  return (
    <TRangeDatePicker
      aria-label="Period"
      className="w-72 max-w-full"
      triggerLabel="Choose the period"
      presetsLabel="Periods"
      value={period}
      presets={presets}
      min={LIMITS.earliestDate}
      max={latestDate()}
      closeOnSelect
      onValueChange={(value) => {
        if (value) setPeriod(value)
      }}
    />
  )
}
