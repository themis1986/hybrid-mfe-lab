import type { Transaction, TransactionInput, TransactionText } from '../types'
import { guardFormula, parseCsv, serializeCsv, type Delimiter } from './csv'
import { CSV_COLUMNS, type CsvColumn, csvRowSchema, REQUIRED_CSV_COLUMNS } from './schemas'
import { toFieldErrors } from './validation'

// Transactions to and from the app's CSV format: the header names the columns (any order, any case on
// import), the amount is positive with a dot, the type says which way it goes, and the category is its id
// (a label also reads back). Pure functions: the UI only reads the file and downloads the text.

/** Files above this size are refused before they are read. */
export const MAX_FILE_BYTES = 5_000_000
/** Rows above this count are refused: one import is one undo step, and a preview has to stay usable. */
export const MAX_ROWS = 10_000

const COLUMN_LABELS: Record<CsvColumn, string> = {
  date: 'Date',
  type: 'Type',
  amount: 'Amount',
  category: 'Category',
  description: 'Description',
  notes: 'Notes',
}

/** RFC 4180 text with a byte-order mark: the header row, then one row per transaction. */
export function transactionsToCsv(transactions: readonly Transaction[]): string {
  return serializeCsv([
    CSV_COLUMNS,
    ...transactions.map((transaction) => [
      transaction.date,
      transaction.type,
      transaction.amount.toFixed(2),
      transaction.category,
      guardFormula(transaction.description),
      guardFormula(transaction.notes ?? ''),
    ]),
  ])
}

/** A file to start from: the header and a few rows that import as they are. */
export function csvTemplate(today: string): string {
  return serializeCsv([
    CSV_COLUMNS,
    [today, 'expense', '42.50', 'groceries', 'Supermarket', ''],
    [today, 'expense', '1250.00', 'housing', 'Rent', 'November'],
    [today, 'income', '3450.00', 'salary', 'Monthly salary', ''],
  ])
}

/** The same transaction twice: one date, one amount and the same description, ignoring case and spaces. */
export function duplicateKey(transaction: Pick<TransactionInput, 'date' | 'amount' | 'description'>): string {
  return `${transaction.date}|${transaction.amount.toFixed(2)}|${transaction.description.trim().toLowerCase()}`
}

export type RowStatus = 'valid' | 'invalid' | 'duplicate'

export interface PreviewRow {
  /** The row's number as a spreadsheet shows it: the header is row 1 (empty lines aren't counted). */
  row: number
  status: RowStatus
  /** The fields as the file has them. */
  text: TransactionText
  /** Set when the row is valid (and so also for a duplicate). */
  input?: TransactionInput
  /** For people: "Amount: Enter an amount greater than 0". */
  problems: string[]
}

export interface ImportPreview {
  delimiter: Delimiter
  rows: PreviewRow[]
  counts: Record<RowStatus, number>
  /** Header names that aren't columns of the format; their values are not read. */
  ignoredColumns: string[]
}

export type ReadResult =
  | { ok: true; preview: ImportPreview }
  | { ok: false; message: string }

const isBlankRow = (fields: readonly string[]) => fields.every((field) => field.trim() === '')

/**
 * Reads a CSV file's text into a preview: every row through the CSV row schema (the form's rules), and
 * valid rows checked for duplicates against the existing transactions and the file's earlier rows. A file
 * that can't be read as transactions at all returns a message instead.
 */
export function readTransactionsCsv(
  text: string,
  existing: readonly Transaction[],
): ReadResult {
  const { rows, delimiter, unterminatedQuote } = parseCsv(text)
  // Numbered before blank rows are dropped, so a row's number is the one a spreadsheet shows.
  const records = rows
    .map((fields, at) => ({ fields, row: at + 1 }))
    .filter(({ fields }) => !isBlankRow(fields))
  const [first, ...body] = records
  if (!first) return { ok: false, message: 'The file is empty.' }
  const header = first.fields

  const names = header.map((name) => name.trim().toLowerCase())
  const index = new Map<CsvColumn, number>()
  const ignoredColumns: string[] = []
  names.forEach((name, at) => {
    const column = CSV_COLUMNS.find((candidate) => candidate === name)
    if (column && !index.has(column)) index.set(column, at)
    else if (name !== '') ignoredColumns.push(header[at]!.trim())
  })

  const missing = REQUIRED_CSV_COLUMNS.filter((column) => !index.has(column))
  if (missing.length > 0) {
    const hint =
      header.length === 1
        ? ' The first row has a single column: separate the columns with commas or semicolons.'
        : ` The first row must name the columns: ${CSV_COLUMNS.join(', ')}.`
    return {
      ok: false,
      message: `The file is missing ${missing.length === 1 ? 'the column' : 'the columns'} ${missing.join(', ')}.${hint}`,
    }
  }
  if (body.length === 0) {
    return { ok: false, message: 'The file has a header row but no transactions.' }
  }
  if (body.length > MAX_ROWS) {
    return {
      ok: false,
      message: `The file has ${body.length.toLocaleString()} rows. Import at most ${MAX_ROWS.toLocaleString()} at a time: split it into smaller files.`,
    }
  }

  const known = new Set(existing.map(duplicateKey))
  const counts: Record<RowStatus, number> = { valid: 0, invalid: 0, duplicate: 0 }

  const preview = body.map(({ fields, row }): PreviewRow => {
    const record: TransactionText = {}
    for (const [column, position] of index) record[column] = fields[position] ?? ''
    const result = csvRowSchema.safeParse(record)

    if (!result.success) {
      const errors = toFieldErrors<CsvColumn>(result.error)
      const problems = CSV_COLUMNS.flatMap((column) =>
        errors[column] ? [`${COLUMN_LABELS[column]}: ${errors[column]}`] : [],
      )
      if (errors.form) problems.push(errors.form)
      counts.invalid++
      return { row, status: 'invalid', text: record, problems }
    }

    const key = duplicateKey(result.data)
    if (known.has(key)) {
      counts.duplicate++
      return {
        row,
        status: 'duplicate',
        text: record,
        input: result.data,
        problems: ['Already in your transactions, or earlier in this file'],
      }
    }
    known.add(key)
    counts.valid++
    return { row, status: 'valid', text: record, input: result.data, problems: [] }
  })

  // The last field swallowed the rest of the file, so the last row can't be trusted, however it parsed.
  const last = preview.at(-1)
  if (unterminatedQuote && last) {
    counts[last.status]--
    counts.invalid++
    last.status = 'invalid'
    delete last.input
    last.problems.push('A quoted field is never closed, so this row runs to the end of the file')
  }

  return { ok: true, preview: { delimiter, rows: preview, counts, ignoredColumns } }
}
