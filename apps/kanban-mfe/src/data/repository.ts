import type { Board } from '../types'

// Where the board lives. Async on purpose, so a backend can replace the in-memory version without
// touching the store or the components.
export interface BoardRepository {
  load(signal: AbortSignal): Promise<Board>
  save(board: Board): Promise<void>
}
