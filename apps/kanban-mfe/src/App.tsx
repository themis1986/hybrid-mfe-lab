import { BoardPage } from './pages/BoardPage'
import { BoardStoreProvider } from './state/StoreContext'
import type { BoardStore } from './state/store'

export function App({ store }: { store: BoardStore }) {
  return (
    <BoardStoreProvider store={store}>
      <BoardPage />
    </BoardStoreProvider>
  )
}
