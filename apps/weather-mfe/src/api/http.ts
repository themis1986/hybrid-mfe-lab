/** GETs JSON; a failed response throws with the API's own reason when it gives one. */
export async function getJson<T>(url: URL, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      reason?: string
      message?: string
    } | null
    throw new Error(
      body?.reason ??
        body?.message ??
        `The request failed (${response.status}).`,
    )
  }
  return response.json() as Promise<T>
}
