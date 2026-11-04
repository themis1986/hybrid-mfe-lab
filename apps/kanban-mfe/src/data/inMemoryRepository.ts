import type { Board } from '../types'
import type { BoardRepository } from './repository'

// Holds the board for as long as the mount lasts. The short delay stands in for a request, so the loading
// state is the one a real backend would show.
export function createInMemoryRepository(
  createBoard: () => Board,
  latencyMs = 250,
): BoardRepository {
  let board: Board | null = null

  return {
    load(signal) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          board ??= createBoard()
          resolve(board)
        }, latencyMs)
        signal.addEventListener('abort', () => {
          clearTimeout(timer)
          reject(signal.reason)
        })
      })
    },
    save(next) {
      board = next
      return Promise.resolve()
    },
  }
}
