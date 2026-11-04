export type ApiErrorKind =
  /** A 429 we could read. */
  | 'rate-limit'
  /**
   * fetch itself failed: offline, or a blocked response. CoinGecko's 429 has no CORS header, so a browser
   * reports it as this and hides its status: "unreachable" may well mean "rate limited".
   */
  | 'unreachable'
  | 'not-found'
  /** Any other 4xx, such as an invalid API key. */
  | 'rejected'
  | 'server'
  /** A 2xx whose body isn't what the provider documents. */
  | 'bad-response'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  /** Who failed, in words the viewer can read. */
  readonly provider: string
  readonly retryAfterMs?: number

  constructor(
    kind: ApiErrorKind,
    provider: string,
    message: string,
    retryAfterMs?: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.provider = provider
    this.retryAfterMs = retryAfterMs
  }
}

function retryAfterMs(response: Response): number | undefined {
  const seconds = Number(response.headers.get('retry-after'))
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined
}

/** GETs JSON. Every failure except a cancellation comes out as an ApiError. */
export async function getJson(
  provider: string,
  url: URL,
  options: { signal?: AbortSignal; headers?: Record<string, string> } = {},
): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(url, options)
  } catch (error) {
    if (options.signal?.aborted) throw error
    throw new ApiError(
      'unreachable',
      provider,
      `${provider} couldn’t be reached.`,
    )
  }

  if (!response.ok) {
    const { status } = response
    if (status === 429) {
      throw new ApiError(
        'rate-limit',
        provider,
        `${provider} is limiting requests.`,
        retryAfterMs(response),
      )
    }
    if (status === 404) {
      throw new ApiError('not-found', provider, `${provider} has no such item.`)
    }
    throw new ApiError(
      status >= 500 ? 'server' : 'rejected',
      provider,
      `${provider} answered with an error (${status}).`,
    )
  }

  try {
    return await response.json()
  } catch (error) {
    if (options.signal?.aborted) throw error
    throw badResponse(provider)
  }
}

export function badResponse(provider: string): ApiError {
  return new ApiError(
    'bad-response',
    provider,
    `${provider} sent an unexpected response.`,
  )
}

/** A finite number, or null for anything else. */
export function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}
