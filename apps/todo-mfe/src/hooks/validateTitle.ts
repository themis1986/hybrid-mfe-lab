export const MAX_TITLE_LENGTH = 120

/** The error to show for a todo title, or undefined when it is valid. Checks the trimmed title. */
export function validateTitle(title: string): string | undefined {
  const trimmed = title.trim()
  if (!trimmed) return 'Write something to do first.'
  if (trimmed.length > MAX_TITLE_LENGTH) return `Keep it under ${MAX_TITLE_LENGTH} characters.`
  return undefined
}
