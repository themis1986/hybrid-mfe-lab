import type { Board } from '../types'

// Undo and redo as a stack of whole boards. Boards are immutable and share every unchanged part, so an
// entry costs little more than the path the action changed.
const LIMIT = 100

export interface History {
  past: Board[]
  present: Board
  future: Board[]
}

export function createHistory(board: Board): History {
  return { past: [], present: board, future: [] }
}

export function commit(history: History, board: Board): History {
  if (board === history.present) return history
  return {
    past: [...history.past, history.present].slice(-LIMIT),
    present: board,
    future: [],
  }
}

export function undo(history: History): History {
  const previous = history.past.at(-1)
  if (!previous) return history
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  }
}

export function redo(history: History): History {
  const [next, ...future] = history.future
  if (!next) return history
  return {
    past: [...history.past, history.present],
    present: next,
    future,
  }
}
