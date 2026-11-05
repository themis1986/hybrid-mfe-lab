import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { today } from '../lib/dates'
import {
  csvTemplate,
  type ImportPreview,
  readTransactionsCsv,
  transactionsToCsv,
} from '../lib/transactionsCsv'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import {
  selectAllTransactions,
  selectPeriod,
  selectVisibleTransactions,
} from '../state/selectors'
import { imported } from '../state/transactions'

/** Hands the text to the browser as a file download, through a Blob. */
function download(text: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  // Later than the click's own task, so the download has started.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** CSV downloads: the current view (the period and filters), everything, or a template. */
export function useCsvExport() {
  const visible = useAppSelector(selectVisibleTransactions)
  const all = useAppSelector(selectAllTransactions)
  const period = useAppSelector(selectPeriod)

  return useMemo(
    () => ({
      viewCount: visible.length,
      allCount: all.length,
      exportView: () =>
        download(transactionsToCsv(visible), `transactions-${period.start}-to-${period.end}.csv`),
      exportAll: () => download(transactionsToCsv(all), `transactions-all-${today()}.csv`),
      downloadTemplate: () => download(csvTemplate(today()), 'transactions-template.csv'),
    }),
    [visible, all, period],
  )
}

export type ImportState =
  | { status: 'idle' }
  | { status: 'reading'; fileName: string }
  | { status: 'error'; fileName: string; message: string }
  | { status: 'preview'; fileName: string; preview: ImportPreview }

/**
 * A CSV import in two steps: choosing a file reads it into a preview (every row checked, nothing stored),
 * then importing adds the valid rows as one action, so one undo step. The File and the preview stay in this
 * hook, out of the store.
 */
export function useCsvImport() {
  const all = useAppSelector(selectAllTransactions)
  const dispatch = useAppDispatch()
  const [files, setFiles] = useState<File[]>([])
  const [state, setState] = useState<ImportState>({ status: 'idle' })
  const latest = useRef(all)
  // Each read gets a number; a read that finishes after a newer one started, or after unmount, is dropped.
  const readId = useRef(0)

  useEffect(() => {
    latest.current = all
  })
  useEffect(
    () => () => {
      readId.current++
    },
    [],
  )

  const reset = useCallback(() => {
    readId.current++
    setFiles([])
    setState({ status: 'idle' })
  }, [])

  const choose = useCallback(async (next: File[]) => {
    setFiles(next)
    const file = next[0]
    const id = ++readId.current
    if (!file) {
      setState({ status: 'idle' })
      return
    }
    setState({ status: 'reading', fileName: file.name })
    try {
      const text = await file.text()
      if (id !== readId.current) return
      const result = readTransactionsCsv(text, latest.current)
      setState(
        result.ok
          ? { status: 'preview', fileName: file.name, preview: result.preview }
          : { status: 'error', fileName: file.name, message: result.message },
      )
    } catch {
      if (id !== readId.current) return
      setState({
        status: 'error',
        fileName: file.name,
        message: "The file couldn't be read. Check that it is a text CSV file.",
      })
    }
  }, [])

  const importValid = useCallback(() => {
    if (state.status !== 'preview') return
    const { rows, counts } = state.preview
    const inputs = rows.flatMap((row) => (row.status === 'valid' && row.input ? [row.input] : []))
    if (inputs.length > 0) {
      dispatch(imported(inputs, { skipped: counts.duplicate, invalid: counts.invalid }))
    }
    reset()
  }, [dispatch, reset, state])

  return { files, state, choose, importValid, cancel: reset }
}
