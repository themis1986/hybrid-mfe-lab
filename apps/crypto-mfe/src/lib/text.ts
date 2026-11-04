const SUMMARY_LENGTH = 600

/** The value if it is an http(s) URL. Provider data can hold anything, including a javascript: link. */
export function safeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}

/**
 * A provider's HTML description as a short plain text. DOMParser builds an inert document (scripts don't run and
 * images don't load), and only its text is kept, so nothing from the provider ever renders as markup.
 */
export function summarize(html: string): string {
  const text = new DOMParser().parseFromString(html, 'text/html').body
    .textContent
  const clean = (text ?? '').replace(/\s+/g, ' ').trim()
  if (clean.length <= SUMMARY_LENGTH) return clean
  const cut = clean.slice(0, SUMMARY_LENGTH)
  const lastSentence = cut.lastIndexOf('. ')
  return lastSentence > 0 ? cut.slice(0, lastSentence + 1) : `${cut}…`
}
