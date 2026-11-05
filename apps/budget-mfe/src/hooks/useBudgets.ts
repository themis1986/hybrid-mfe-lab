import { useMemo } from 'react'
import { addMonthsToKey, today } from '../lib/dates'
import { limitRemoved, limitSet } from '../state/budgets'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import {
  selectBudgetLimits,
  selectBudgetMonth,
  selectBudgetProgress,
  selectBudgetTotals,
} from '../state/selectors'
import { budgetMonthChanged } from '../state/ui'
import type { Budget, ExpenseCategoryId } from '../types'

/** The budgets of the month shown, the month itself, and the actions on both. Limit changes are undoable. */
export function useBudgets() {
  const month = useAppSelector(selectBudgetMonth)
  const progress = useAppSelector(selectBudgetProgress)
  const totals = useAppSelector(selectBudgetTotals)
  const limits = useAppSelector(selectBudgetLimits)
  const dispatch = useAppDispatch()
  const currentMonth = today().slice(0, 7)

  const actions = useMemo(
    () => ({
      setLimit: (budget: Budget) => {
        dispatch(limitSet(budget))
      },
      removeLimit: (category: ExpenseCategoryId) => {
        dispatch(limitRemoved(category))
      },
      showMonth: (next: string) => {
        dispatch(budgetMonthChanged(next))
      },
    }),
    [dispatch],
  )

  return {
    month,
    progress,
    totals,
    limits,
    /** Months after the current one have no spending yet, so the stepper stops there. */
    canGoForward: month < currentMonth,
    previousMonth: () => actions.showMonth(addMonthsToKey(month, -1)),
    nextMonth: () => actions.showMonth(addMonthsToKey(month, 1)),
    ...actions,
  }
}
