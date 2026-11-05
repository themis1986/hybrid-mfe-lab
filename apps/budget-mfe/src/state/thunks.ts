import { createAsyncThunk } from '@reduxjs/toolkit'
import type { BudgetRepository, LedgerSnapshot } from '../data/repository'

/** What thunks get besides dispatch and state. Not in the state: the repository is not plain data. */
export interface ThunkExtra {
  repository: BudgetRepository
  /** Aborted when the mount ends, so nothing the store started outlives it. */
  signal: AbortSignal
}

/** Loads the ledger; also the retry after a failed load. A new load starts a new history. */
export const loadLedger = createAsyncThunk<
  LedgerSnapshot,
  void,
  { extra: ThunkExtra }
>('ledger/load', (_, { extra, signal }) =>
  extra.repository.load(AbortSignal.any([signal, extra.signal])),
)
