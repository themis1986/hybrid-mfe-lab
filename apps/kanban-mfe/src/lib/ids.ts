/** A new id for a card, column or checklist item. */
export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}
