import { getTableColumnValue } from './columns'
import type { TableColumnData } from './types'

// Spreadsheets run a cell that starts with one of these as a formula; exported data may be user-written.
const FORMULA_START = /^[=+\-@\t\r]/

function escapeField(text: string): string {
  const guarded = FORMULA_START.test(text) ? `'${text}` : text
  return /[",\r\n]/.test(guarded)
    ? `"${guarded.replaceAll('"', '""')}"`
    : guarded
}

export interface ToCsvOptions {
  /** Default: true. A byte-order mark, which Excel needs to read UTF-8. */
  bom?: boolean
}

/**
 * RFC 4180 text for the given rows and columns, in their order. Raw values by default, so numbers and dates
 * stay machine-readable, or the column's `csv` function. A number stays as it is, even when negative.
 */
export function toCsv<TData>(
  rows: readonly TData[],
  columns: readonly TableColumnData<TData>[],
  { bom = true }: ToCsvOptions = {},
): string {
  const included = columns.filter(
    (column) =>
      column.csv !== false && (column.accessorKey || column.accessorFn),
  )
  const lines = [included.map((column) => escapeField(column.title)).join(',')]
  rows.forEach((row, index) => {
    const fields = included.map((column) => {
      const value = getTableColumnValue(column, row, index)
      if (typeof column.csv === 'function') {
        return escapeField(column.csv(value, row))
      }
      if (typeof value === 'number') return String(value)
      if (value === null || value === undefined) return ''
      return escapeField(
        typeof value === 'object' ? JSON.stringify(value) : String(value),
      )
    })
    lines.push(fields.join(','))
  })
  return `${bom ? '﻿' : ''}${lines.join('\r\n')}\r\n`
}

export function downloadCsv(text: string, fileName = 'table.csv'): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  // Later than the click's own task, so the download has started.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
