import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { createId } from '../lib/ids'
import type { Transaction, TransactionId, TransactionInput } from '../types'
import { ledgerCleared } from './actions'
import { loadLedger } from './thunks'

/** Newest first; transactions of the same day by when they were entered. */
export const transactionsAdapter = createEntityAdapter<Transaction>({
  sortComparer: (a, b) =>
    b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
})

// Ids and timestamps are made in `prepare`, before the reducer runs, so the reducer stays pure.
function stamp(input: TransactionInput, createdAt: string): Transaction {
  return { ...input, id: createId(), createdAt }
}

function sameInput(a: TransactionInput, b: TransactionInput): boolean {
  return (
    a.type === b.type &&
    a.amount === b.amount &&
    a.date === b.date &&
    a.category === b.category &&
    a.description === b.description &&
    (a.notes ?? '') === (b.notes ?? '')
  )
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState(),
  reducers: {
    added: {
      reducer: transactionsAdapter.addOne,
      prepare: (input: TransactionInput) => ({
        payload: stamp(input, new Date().toISOString()),
      }),
    },

    updated(
      state,
      action: PayloadAction<{ id: TransactionId; input: TransactionInput }>,
    ) {
      const { id, input } = action.payload
      const existing = state.entities[id]
      // Saving unchanged values changes nothing, so it adds no undo step.
      if (!existing || sameInput(existing, input)) return
      transactionsAdapter.setOne(state, {
        ...input,
        id,
        createdAt: existing.createdAt,
      })
    },

    /** One or many: a bulk delete is one undo step. */
    removed(state, action: PayloadAction<TransactionId[]>) {
      transactionsAdapter.removeMany(state, action.payload)
    },

    /** The valid rows of a CSV file, as one undo step. */
    imported: {
      reducer: transactionsAdapter.addMany,
      prepare: (inputs: TransactionInput[]) => {
        const createdAt = new Date().toISOString()
        return { payload: inputs.map((input) => stamp(input, createdAt)) }
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLedger.fulfilled, (state, action) => {
        transactionsAdapter.setAll(state, action.payload.transactions)
      })
      .addCase(ledgerCleared, (state) => {
        transactionsAdapter.removeAll(state)
      })
  },
})

export const { added, updated, removed, imported } = transactionsSlice.actions
export const transactionsReducer = transactionsSlice.reducer
