// The app's data model. The shapes come from the Zod schemas (lib/schemas.ts) and the category ids
// (lib/categories.ts), so they are written once. Everything here is plain data, so it can cross a repository.
import type { TransactionInput } from './lib/schemas'

export type {
  Budget,
  TransactionField,
  TransactionInput,
  TransactionText,
  TransactionType,
} from './lib/schemas'
export type {
  CategoryId,
  ExpenseCategoryId,
  IncomeCategoryId,
} from './lib/categories'
export type { Period } from './lib/periods'

export type TransactionId = string

/** A stored transaction: what was entered, plus the id and creation time the store gives it. */
export interface Transaction extends TransactionInput {
  id: TransactionId
  /** ISO timestamp; orders transactions of the same day. */
  createdAt: string
}
