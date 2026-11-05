import {
  createAction,
  type Reducer,
  type UnknownAction,
} from '@reduxjs/toolkit'

// Undo and redo as a stack of whole states. Redux Toolkit has none built in, and a dependency for twenty
// lines isn't worth it. Immer shares every unchanged part between states, so an entry costs little more
// than the path the action changed, and there is no inverse action to get wrong for each new action.

export interface History<S> {
  past: S[]
  present: S
  future: S[]
}

export const undo = createAction('history/undo')
export const redo = createAction('history/redo')

export interface UndoableOptions {
  /** Entries kept in the past. */
  limit?: number
  /** Actions that replace the state and start a new history, such as a load. */
  resetOn?: (action: UnknownAction) => boolean
}

/**
 * Wraps a reducer so every change it makes is one undo step. An action that changes nothing returns the
 * same state, so it adds no entry; a new change clears what could be redone.
 */
export function undoable<S>(
  reducer: Reducer<S, UnknownAction>,
  { limit = 50, resetOn = () => false }: UndoableOptions = {},
): Reducer<History<S>, UnknownAction> {
  return (state, action) => {
    if (state === undefined) {
      return { past: [], present: reducer(undefined, action), future: [] }
    }

    if (undo.match(action)) {
      const previous = state.past.at(-1)
      if (previous === undefined) return state
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      }
    }

    if (redo.match(action)) {
      const [next, ...future] = state.future
      if (next === undefined) return state
      return { past: [...state.past, state.present], present: next, future }
    }

    const present = reducer(state.present, action)
    if (resetOn(action)) return { past: [], present, future: [] }
    if (present === state.present) return state
    return {
      past: [...state.past, state.present].slice(-limit),
      present,
      future: [],
    }
  }
}
