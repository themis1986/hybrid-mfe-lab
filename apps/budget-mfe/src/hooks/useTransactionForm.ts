import { useState } from 'react'
import { CATEGORIES, isCategoryId } from '../lib/categories'
import { today } from '../lib/dates'
import { toAmountText } from '../lib/money'
import { transactionFormSchema } from '../lib/schemas'
import { type FieldErrors, parseWith } from '../lib/validation'
import type {
  Transaction,
  TransactionField,
  TransactionInput,
  TransactionType,
} from '../types'

/** The form's values: the controls' strings, every field present. */
export type TransactionFormValues = Record<TransactionField, string>

/** In the order the form shows them, which is also the order the first error gets focus in. */
export const TRANSACTION_FIELDS: readonly TransactionField[] = [
  'type',
  'amount',
  'date',
  'category',
  'description',
  'notes',
]

export function emptyFormValues(type: TransactionType = 'expense'): TransactionFormValues {
  return {
    type,
    amount: '',
    date: today(),
    category: '',
    description: '',
    notes: '',
  }
}

/** A transaction's values in the form; a copy (Duplicate) is dated today. */
export function formValuesOf(
  transaction: Transaction,
  { asCopy = false } = {},
): TransactionFormValues {
  return {
    type: transaction.type,
    amount: toAmountText(transaction.amount),
    date: asCopy ? today() : transaction.date,
    category: transaction.category,
    description: transaction.description,
    notes: transaction.notes ?? '',
  }
}

type Errors = FieldErrors<TransactionField>

function onlyShown(
  errors: FieldErrors<string>,
  shown: ReadonlySet<TransactionField>,
): Errors {
  const visible: Errors = {}
  for (const field of shown) {
    const message = errors[field]
    if (message) visible[field] = message
  }
  return visible
}

export type SubmitResult =
  | { ok: true; value: TransactionInput }
  | { ok: false; firstError: TransactionField }

/**
 * The transaction dialog's unsaved values and their messages. Validation runs through the shared schema on
 * a field's blur (or its change, for a choice), on submit, and while a field shows an error, so the message
 * clears as soon as the value is right. Saving turns the values into one action, so one undo step.
 */
export function useTransactionForm(initial: TransactionFormValues) {
  const [values, setValues] = useState(initial)
  const [shown, setShown] = useState<ReadonlySet<TransactionField>>(
    () => new Set(),
  )
  const [errors, setErrors] = useState<Errors>({})

  function check(
    next: TransactionFormValues,
    nextShown: ReadonlySet<TransactionField>,
  ) {
    const result = parseWith<TransactionInput, TransactionField>(
      transactionFormSchema,
      next,
    )
    setErrors(result.ok ? {} : onlyShown(result.errors, nextShown))
    return result
  }

  function show(field: TransactionField) {
    const next = new Set(shown).add(field)
    setShown(next)
    return next
  }

  return {
    values,
    errors,
    /**
     * Submit is blocked while a message shows. A form nobody has touched stays submittable: pressing Save
     * then shows every message at once, where a disabled button would explain nothing.
     */
    canSubmit: Object.keys(errors).length === 0,

    /** Typing in a text field. */
    change(field: TransactionField, value: string) {
      const next = { ...values, [field]: value }
      setValues(next)
      if (errors[field]) check(next, shown)
    },

    /** Leaving a text field: its message, if any, shows from now on. */
    blur(field: TransactionField) {
      check(values, show(field))
    },

    /** Picking a value in a choice control (category, date): it is checked at once. */
    choose(field: TransactionField, value: string) {
      const next = { ...values, [field]: value }
      setValues(next)
      check(next, show(field))
    },

    /** Switching income and expense keeps the category only if it belongs to the new type. */
    chooseType(type: TransactionType) {
      const keep =
        isCategoryId(values.category) &&
        CATEGORIES[values.category].type === type
      const next = { ...values, type, category: keep ? values.category : '' }
      setValues(next)
      check(next, shown)
    },

    /** Checks everything and shows every message. */
    submit(): SubmitResult {
      const all = new Set(TRANSACTION_FIELDS)
      setShown(all)
      const result = check(values, all)
      if (result.ok) return { ok: true, value: result.value }
      const firstError =
        TRANSACTION_FIELDS.find((field) => field in result.errors) ?? 'amount'
      return { ok: false, firstError }
    },
  }
}
