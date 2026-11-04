/**
 * A random id. Not `crypto.randomUUID()`: browsers only provide it on HTTPS and localhost, and the
 * app is also opened over plain HTTP from other devices on the network.
 */
export function createId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}
