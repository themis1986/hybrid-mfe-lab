/** A new id for a transaction. */
export function createId(): string {
  return `txn-${crypto.randomUUID()}`
}
