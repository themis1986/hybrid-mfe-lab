import { useState } from 'react'
import { toAmountText } from '../lib/money'
import { budgetFormSchema } from '../lib/schemas'
import { parseWith } from '../lib/validation'
import type { Budget, ExpenseCategoryId } from '../types'

/** The budget dialog's limit, checked by the shared schema on blur and submit, like the transaction form. */
export function useBudgetForm(category: ExpenseCategoryId, limit: number | null) {
  const [value, setValue] = useState(limit === null ? '' : toAmountText(limit))
  const [error, setError] = useState<string | undefined>()

  function check(text: string) {
    const result = parseWith<Budget, 'category' | 'monthlyLimit'>(budgetFormSchema, {
      category,
      monthlyLimit: text,
    })
    setError(result.ok ? undefined : (result.errors.monthlyLimit ?? result.errors.category))
    return result
  }

  return {
    value,
    error,
    change(text: string) {
      setValue(text)
      if (error) check(text)
    },
    blur() {
      check(value)
    },
    /** The budget to save, or null after showing why not. */
    submit(): Budget | null {
      const result = check(value)
      return result.ok ? result.value : null
    },
  }
}
