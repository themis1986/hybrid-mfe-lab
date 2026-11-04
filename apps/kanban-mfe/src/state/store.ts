import type { BoardRepository } from '../data/repository'
import type { Board } from '../types'
import type { BoardAction } from './actions'
import { commit, createHistory, type History, redo, undo } from './history'
import { boardReducer } from './reducer'

export type BoardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; history: History }

/** Each change to the board: an action, an undo or a redo. */
export type BoardChange =
  | { kind: 'action'; action: BoardAction; before: Board }
  | { kind: 'undo' }
  | { kind: 'redo' }

export type ChangeListener = (change: BoardChange) => void

export interface BoardStore {
  getState(): BoardState
  subscribe(listener: () => void): () => void
  onChange(listener: ChangeListener): () => void
  /** Loads the board; also the retry after a failed load. */
  load(): void
  /** Returns whether the action changed the board. */
  dispatch(action: BoardAction): boolean
  undo(): void
  redo(): void
  /** Aborts what's running and turns every later call into a no-op. */
  dispose(): void
}

// A plain object with no React in it. mount() creates one per mount, never at module scope: the federated
// module stays cached after unmount, so a module-level store would carry the board into the next mount.
export function createBoardStore(repository: BoardRepository): BoardStore {
  let state: BoardState = { status: 'loading' }
  let disposed = false
  let loading: AbortController | null = null
  const listeners = new Set<() => void>()
  const changeListeners = new Set<ChangeListener>()

  function setState(next: BoardState) {
    state = next
    for (const listener of listeners) listener()
  }

  function setHistory(history: History, change: BoardChange) {
    setState({ status: 'ready', history })
    repository.save(history.present).catch((error: unknown) => {
      console.error('Saving the board failed:', error)
    })
    for (const listener of changeListeners) listener(change)
  }

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    onChange(listener) {
      changeListeners.add(listener)
      return () => changeListeners.delete(listener)
    },

    load() {
      if (disposed) return
      loading?.abort()
      const controller = new AbortController()
      loading = controller
      setState({ status: 'loading' })
      repository.load(controller.signal).then(
        (board) => {
          if (controller.signal.aborted) return
          setState({ status: 'ready', history: createHistory(board) })
        },
        (error: unknown) => {
          if (controller.signal.aborted) return
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
          })
        },
      )
    },

    dispatch(action) {
      if (disposed || state.status !== 'ready') return false
      const before = state.history.present
      const after = boardReducer(before, action)
      if (after === before) return false
      setHistory(commit(state.history, after), {
        kind: 'action',
        action,
        before,
      })
      return true
    },

    undo() {
      if (disposed || state.status !== 'ready') return
      const history = undo(state.history)
      if (history !== state.history) setHistory(history, { kind: 'undo' })
    },

    redo() {
      if (disposed || state.status !== 'ready') return
      const history = redo(state.history)
      if (history !== state.history) setHistory(history, { kind: 'redo' })
    },

    dispose() {
      disposed = true
      loading?.abort()
      listeners.clear()
      changeListeners.clear()
    },
  }
}
