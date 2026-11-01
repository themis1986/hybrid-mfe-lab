import { type Ref, type RefObject, useCallback } from 'react'

/** One ref callback that fills both the component's own ref and the caller's (a callback or an object ref). */
export function useComposedRef<T>(own: RefObject<T | null>, caller: Ref<T> | undefined) {
  return useCallback(
    (node: T | null) => {
      own.current = node
      if (typeof caller === 'function') caller(node)
      else if (caller) caller.current = node
    },
    [own, caller],
  )
}
