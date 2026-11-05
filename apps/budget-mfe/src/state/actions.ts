import { createAction } from '@reduxjs/toolkit'

/** Removes every transaction and budget at once: one undo step brings them all back. */
export const ledgerCleared = createAction('ledger/cleared')
