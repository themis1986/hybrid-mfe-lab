import {
  createContext,
  type ReactNode,
  useContext,
  useSyncExternalStore,
} from 'react'
import type { BoardState, BoardStore } from './store'

const StoreContext = createContext<BoardStore | null>(null)

export function BoardStoreProvider({
  store,
  children,
}: {
  store: BoardStore
  children: ReactNode
}) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useBoardStore(): BoardStore {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useBoardStore needs a BoardStoreProvider.')
  return store
}

/**
 * Reads one piece of the store. The component re-renders only when that piece changes, and boards share
 * unchanged parts, so a selector can return part of the board as it is. It must not build a new object.
 */
export function useBoardStoreSelector<T>(
  selector: (state: BoardState) => T,
): T {
  const store = useBoardStore()
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()))
}
