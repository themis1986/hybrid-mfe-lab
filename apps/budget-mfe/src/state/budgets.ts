import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Budget, ExpenseCategoryId } from '../types'
import { ledgerCleared } from './actions'
import { loadLedger } from './thunks'

export interface BudgetsState {
  /** The monthly limit of each expense category that has one. */
  limits: Partial<Record<ExpenseCategoryId, number>>
}

const initialState: BudgetsState = { limits: {} }

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    limitSet(state, action: PayloadAction<Budget>) {
      const { category, monthlyLimit } = action.payload
      if (state.limits[category] === monthlyLimit) return
      state.limits[category] = monthlyLimit
    },
    limitRemoved(state, action: PayloadAction<ExpenseCategoryId>) {
      if (!(action.payload in state.limits)) return
      delete state.limits[action.payload]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLedger.fulfilled, (state, action) => {
        state.limits = Object.fromEntries(
          action.payload.budgets.map((budget) => [
            budget.category,
            budget.monthlyLimit,
          ]),
        )
      })
      .addCase(ledgerCleared, (state) => {
        state.limits = {}
      })
  },
})

export const { limitSet, limitRemoved } = budgetsSlice.actions
export const budgetsReducer = budgetsSlice.reducer
