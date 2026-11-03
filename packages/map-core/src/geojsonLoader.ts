import type { GeoJSON } from 'geojson'
import type { GeoJsonLoadState } from './types'

export interface GeoJsonLoadOptions {
  /** Re-fetches every N milliseconds after the previous request settles. 0 or unset: once. */
  refreshInterval?: number
}

export interface GeoJsonLoader {
  /** Starts loading `url`, aborting any request or refresh timer of the previous one. */
  load(url: string, options?: GeoJsonLoadOptions): void
  /** Aborts the request and the refresh timer. */
  dispose(): void
}

/**
 * Loads remote GeoJSON for a layer: plain state handed to `onChange` (each framework re-renders or
 * forwards it). A stale request is aborted when the URL changes or the layer unmounts; the last data stays
 * in the state while a refresh is in flight or after it fails.
 */
export function createGeoJsonLoader(
  onChange: (state: GeoJsonLoadState) => void,
): GeoJsonLoader {
  let state: GeoJsonLoadState = { status: 'idle' }
  let controller: AbortController | undefined
  let timer: ReturnType<typeof setTimeout> | undefined

  const set = (next: GeoJsonLoadState) => {
    state = next
    onChange(state)
  }

  function stop() {
    controller?.abort()
    controller = undefined
    clearTimeout(timer)
    timer = undefined
  }

  async function fetchOnce(url: string, options: GeoJsonLoadOptions) {
    const current = new AbortController()
    controller = current
    set({ ...state, status: 'loading', error: undefined })
    try {
      const response = await fetch(url, { signal: current.signal })
      if (!response.ok)
        throw new Error(
          `GeoJSON request failed: ${response.status} ${response.statusText}`,
        )
      const data = (await response.json()) as GeoJSON
      if (typeof data?.type !== 'string')
        throw new Error('The response is not GeoJSON')
      if (!current.signal.aborted) set({ status: 'loaded', data })
    } catch (error) {
      if (current.signal.aborted) return
      set({
        ...state,
        status: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }
    if (!current.signal.aborted && options.refreshInterval)
      timer = setTimeout(() => fetchOnce(url, options), options.refreshInterval)
  }

  return {
    load(url, options = {}) {
      stop()
      state = { status: 'idle' }
      void fetchOnce(url, options)
    },
    dispose: stop,
  }
}
