/**
 * A new id for a card, column or checklist item. Not `crypto.randomUUID()`: browsers only provide it
 * on HTTPS and localhost, and the app is also opened over plain HTTP from other devices on the network.
 */
export function createId(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const random = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
  return `${prefix}-${random.join('')}`
}
