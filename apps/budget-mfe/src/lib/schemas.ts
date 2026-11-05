import { z } from 'zod'
import {
  CATEGORIES,
  CATEGORY_IDS,
  type CategoryId,
  EXPENSE_CATEGORY_IDS,
  resolveCategory,
} from './categories'
import { unguardFormula } from './csv'
import { addMonths, today } from './dates'
import { formatMoney, hasAtMostTwoDecimals, parseAmountText } from './money'

// The single source of truth for what a transaction and a budget may hold. The types are inferred from
// these schemas (src/types.ts re-exports them). Data is parsed here at the edges only: a form submit or
// blur, a CSV import, the seed. Every message is written for people; lib/validation.ts hands them to the UI.

export const TRANSACTION_TYPES = ['income', 'expense'] as const

export const LIMITS = {
  /** Amounts must be below this. */
  amountMax: 1_000_000_000,
  descriptionMax: 120,
  notesMax: 500,
  earliestDate: '2000-01-01',
} as const

/** The latest date a transaction may have: a year from today, for planned payments. */
export function latestDate(now: string = today()): string {
  return addMonths(now, 12)
}

const isBlank = (input: unknown) => input === undefined || input === ''

const typeSchema = z.enum(TRANSACTION_TYPES, {
  error: (issue) =>
    isBlank(issue.input)
      ? 'Choose income or expense'
      : `Use “income” or “expense”, not “${String(issue.input)}”`,
})

const amountSchema = z
  .number({
    error: (issue) =>
      isBlank(issue.input) ? 'Enter an amount' : 'Enter a number, like 12.50',
  })
  .gt(0, { error: 'Enter an amount greater than 0' })
  .lt(LIMITS.amountMax, {
    error: `Enter an amount below ${formatMoney(LIMITS.amountMax)}`,
  })
  .refine(hasAtMostTwoDecimals, { error: 'Use at most 2 decimal places' })

const dateSchema = z.iso
  .date({
    error: (issue) =>
      isBlank(issue.input) ? 'Enter a date' : 'Enter a valid date, as YYYY-MM-DD',
  })
  .refine((date) => date >= LIMITS.earliestDate, {
    error: 'Pick a date in 2000 or later',
  })
  .refine((date) => date <= latestDate(), {
    error: 'Pick a date no more than a year from today',
  })

const categorySchema = z.enum(CATEGORY_IDS, {
  error: (issue) =>
    isBlank(issue.input)
      ? 'Pick a category'
      : `There is no category called “${String(issue.input)}”`,
})

const descriptionSchema = z
  .string({ error: 'Enter a description' })
  .trim()
  .min(1, { error: 'Enter a description' })
  .max(LIMITS.descriptionMax, {
    error: `Keep the description to ${LIMITS.descriptionMax} characters or fewer`,
  })

const notesSchema = z
  .string()
  .trim()
  .max(LIMITS.notesMax, {
    error: `Keep the notes to ${LIMITS.notesMax} characters or fewer`,
  })
  .optional()

/** A transaction as someone enters it, before it has an id. */
export const transactionInputSchema = z
  .object({
    type: typeSchema,
    amount: amountSchema,
    date: dateSchema,
    category: categorySchema,
    description: descriptionSchema,
    notes: notesSchema,
  })
  .superRefine((value, ctx) => {
    // Guarded: the other fields may be invalid too, and then this check has nothing to compare.
    const category = CATEGORIES[value.category as CategoryId] as
      | (typeof CATEGORIES)[CategoryId]
      | undefined
    if (category && category.type !== value.type) {
      ctx.addIssue({
        code: 'custom',
        path: ['category'],
        input: value.category,
        message:
          value.type === 'income'
            ? 'Pick an income category'
            : 'Pick an expense category',
      })
    }
  })

/** A monthly spending limit for one expense category. */
export const budgetSchema = z.object({
  category: z.enum(EXPENSE_CATEGORY_IDS, { error: 'Pick an expense category' }),
  monthlyLimit: amountSchema,
})

export type TransactionType = z.infer<typeof typeSchema>
export type TransactionInput = z.infer<typeof transactionInputSchema>
export type TransactionField = keyof TransactionInput
export type Budget = z.infer<typeof budgetSchema>

// Text fronts. A form and a CSV file both hold strings; one coercion turns them into the typed shape, then
// the same transactionInputSchema applies, so a row is valid in a file exactly when it is valid in the form.

/** A transaction as text: the form's values, or one CSV row by column. */
export type TransactionText = Partial<Record<TransactionField, string>>

function blankToUndefined(text: string | undefined): string | undefined {
  const value = text?.trim()
  return value ? value : undefined
}

function fromText(record: TransactionText): Record<TransactionField, unknown> {
  const amount = blankToUndefined(record.amount)
  return {
    type: blankToUndefined(record.type)?.toLowerCase(),
    amount: amount === undefined ? undefined : parseAmountText(amount),
    date: blankToUndefined(record.date),
    category:
      record.category === undefined
        ? undefined
        : blankToUndefined(resolveCategory(record.category)),
    description: record.description ?? '',
    notes: blankToUndefined(record.notes),
  }
}

/** The transaction form's values: the controls' strings. */
export const transactionFormSchema = z.preprocess(
  (values: TransactionText) => fromText(values),
  transactionInputSchema,
)

/** The columns of the CSV format, in the order the export writes them. */
export const CSV_COLUMNS = [
  'date',
  'type',
  'amount',
  'category',
  'description',
  'notes',
] as const satisfies readonly TransactionField[]
export type CsvColumn = (typeof CSV_COLUMNS)[number]
export const REQUIRED_CSV_COLUMNS: readonly CsvColumn[] = CSV_COLUMNS.filter(
  (column) => column !== 'notes',
)

/**
 * One CSV row, by column. Text fields lose the formula guard the export adds (a leading apostrophe before
 * = + - @), so an exported file reads back exactly.
 */
export const csvRowSchema = z.preprocess(
  (record: TransactionText) =>
    fromText({
      ...record,
      description:
        record.description === undefined
          ? undefined
          : unguardFormula(record.description),
      notes: record.notes === undefined ? undefined : unguardFormula(record.notes),
    }),
  transactionInputSchema,
)

/** The budget dialog's values. */
export const budgetFormSchema = z.preprocess(
  (values: { category: string; monthlyLimit: string }) => {
    const limit = blankToUndefined(values.monthlyLimit)
    return {
      category: values.category,
      monthlyLimit: limit === undefined ? undefined : parseAmountText(limit),
    }
  },
  budgetSchema,
)
