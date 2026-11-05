import { useMemo } from 'react'
import { today } from '../lib/dates'
import { type Period, periodPresets } from '../lib/periods'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { selectPeriod } from '../state/selectors'
import { periodChanged } from '../state/ui'

/** The period every page shows, the ranges offered for it, and the action that changes it. */
export function usePeriod() {
  const period = useAppSelector(selectPeriod)
  const dispatch = useAppDispatch()
  const presets = useMemo(() => periodPresets(today()), [])
  const setPeriod = useMemo(
    () => (next: Period) => {
      dispatch(periodChanged(next))
    },
    [dispatch],
  )
  return { period, presets, setPeriod }
}
