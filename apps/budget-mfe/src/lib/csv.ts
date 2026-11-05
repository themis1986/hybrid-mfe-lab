// RFC 4180 CSV, both ways, with no knowledge of transactions (transactionsCsv.ts maps rows onto them).
// Fields may be quoted; a quoted field may hold the delimiter, quotes (doubled) and line breaks. Lines end in
// \r\n, \n or \r. Pure functions only.

export type Delimiter = ',' | ';'

const BOM = '﻿'

// Spreadsheets run a cell that starts with one of these as a formula, and the text here is user-written.
// The export prefixes an apostrophe (as @repo/table-core's export does); the import takes it off again.
const FORMULA_START = /^[=+\-@\t\r]/
const GUARDED = /^'[=+\-@\t\r]/

export function guardFormula(text: string): string {
  return FORMULA_START.test(text) ? `'${text}` : text
}

export function unguardFormula(text: string): string {
  return GUARDED.test(text) ? text.slice(1) : text
}

/**
 * The delimiter of the first line: a semicolon when it has more of them than commas outside quotes (the
 * export of a spreadsheet set to a locale with decimal commas), a comma otherwise.
 */
export function detectDelimiter(text: string): Delimiter {
  let commas = 0
  let semicolons = 0
  let quoted = false
  for (const char of text.startsWith(BOM) ? text.slice(1) : text) {
    if (char === '"') quoted = !quoted
    else if (!quoted && (char === '\n' || char === '\r')) break
    else if (!quoted && char === ',') commas++
    else if (!quoted && char === ';') semicolons++
  }
  return semicolons > commas ? ';' : ','
}

export interface ParsedCsv {
  rows: string[][]
  delimiter: Delimiter
  /** The text ended inside a quoted field: the last field runs to the end of the file. */
  unterminatedQuote: boolean
}

/** Splits CSV text into rows of fields. A leading byte-order mark and blank lines are dropped. */
export function parseCsv(text: string, delimiter = detectDelimiter(text)): ParsedCsv {
  const source = text.startsWith(BOM) ? text.slice(1) : text
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  // Whether the current row has any content yet: a line with nothing on it is skipped, not read as [''].
  let rowStarted = false

  const endField = () => {
    row.push(field)
    field = ''
  }
  const endRow = () => {
    if (rowStarted) {
      endField()
      rows.push(row)
    }
    row = []
    field = ''
    rowStarted = false
  }

  for (let i = 0; i < source.length; i++) {
    const char = source[i]!
    if (quoted) {
      if (char !== '"') field += char
      else if (source[i + 1] === '"') {
        field += '"'
        i++
      } else quoted = false
      continue
    }
    if (char === '"') {
      quoted = true
      rowStarted = true
    } else if (char === delimiter) {
      endField()
      rowStarted = true
    } else if (char === '\r' || char === '\n') {
      if (char === '\r' && source[i + 1] === '\n') i++
      endRow()
    } else {
      field += char
      rowStarted = true
    }
  }
  const unterminatedQuote = quoted
  endRow()
  return { rows, delimiter, unterminatedQuote }
}

function escapeField(text: string, delimiter: Delimiter): string {
  return text.includes(delimiter) || /["\r\n]/.test(text)
    ? `"${text.replaceAll('"', '""')}"`
    : text
}

export interface SerializeOptions {
  /** Default: true. A byte-order mark, which Excel needs to read UTF-8. */
  bom?: boolean
  delimiter?: Delimiter
}

/** RFC 4180 text: fields quoted when needed, \r\n after every row, including the last. */
export function serializeCsv(
  rows: readonly (readonly string[])[],
  { bom = true, delimiter = ',' }: SerializeOptions = {},
): string {
  const lines = rows.map((fields) =>
    fields.map((field) => escapeField(field, delimiter)).join(delimiter),
  )
  return `${bom ? BOM : ''}${lines.map((line) => `${line}\r\n`).join('')}`
}
