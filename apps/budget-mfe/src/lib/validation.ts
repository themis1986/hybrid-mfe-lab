import { z } from 'zod'

/** One message per field, written for people. The UI reads these, never Zod's error objects. */
export type FieldErrors<K extends string = string> = Partial<Record<K, string>>

export type ParseResult<T, K extends string> =
  | { ok: true; value: T }
  | { ok: false; errors: FieldErrors<K> }

// Every schema in schemas.ts sets its own messages; this covers a check that doesn't.
const FALLBACK = 'Check this value'

/** The first message for each field; issues that belong to no field go under `form`. */
export function toFieldErrors<K extends string>(
  error: z.ZodError,
): FieldErrors<K | 'form'> {
  const { fieldErrors, formErrors } = z.flattenError(
    error,
    (issue) => issue.message || FALLBACK,
  )
  const errors: Record<string, string> = {}
  for (const [field, messages] of Object.entries(
    fieldErrors as Record<string, string[] | undefined>,
  )) {
    const [first] = messages ?? []
    if (first) errors[field] = first
  }
  if (formErrors[0]) errors.form = formErrors[0]
  return errors as FieldErrors<K | 'form'>
}

/** Runs a schema and returns either the value or the messages by field. */
export function parseWith<T, K extends string = string>(
  schema: z.ZodType<T>,
  input: unknown,
): ParseResult<T, K | 'form'> {
  const result = schema.safeParse(input)
  return result.success
    ? { ok: true, value: result.data }
    : { ok: false, errors: toFieldErrors<K>(result.error) }
}
