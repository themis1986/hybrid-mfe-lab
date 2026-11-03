import { useLayoutEffect, useRef } from 'react'

/** The latest value, for engine listeners bound once that must call the caller's current callbacks. */
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
