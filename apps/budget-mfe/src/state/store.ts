import {
  addListener,
  clearAllListeners,
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit'
import type { BudgetRepository } from '../data/repository'
import { ledgerReducer, toSnapshot } from './ledger'
import { loadLedger, type ThunkExtra } from './thunks'
import { uiReducer } from './ui'

const rootReducer = combineReducers({ ledger: ledgerReducer, ui: uiReducer })

/** From the reducer rather than the store, so slices and selectors can name it without a cycle. */
export type RootState = ReturnType<typeof rootReducer>

// Past and future states were checked when they were the present; walking 50 of them on every action would
// only slow the development checks down.
const HISTORY_PATHS = ['ledger.past', 'ledger.future']

/**
 * One store per mount. mount() calls this, never module scope: the federated module stays cached after
 * unmount, so a module-level store would carry the ledger into the next mount.
 */
export function createBudgetStore({
  repository,
}: {
  repository: BudgetRepository
}) {
  const lifetime = new AbortController()
  const listeners = createListenerMiddleware()
  const extra: ThunkExtra = { repository, signal: lifetime.signal }

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: extra },
        immutableCheck: { ignoredPaths: HISTORY_PATHS },
        serializableCheck: { ignoredPaths: HISTORY_PATHS },
        // First, so it sees addListener actions (which carry functions) before the serializable check does.
      }).prepend(listeners.middleware),
  })

  // Every change of the ledger goes to the repository, as it would go to a backend. A load already came from
  // there, so it isn't saved back.
  listeners.startListening.withTypes<RootState>()({
    predicate: (action, current, previous) =>
      current.ledger.present !== previous.ledger.present &&
      !loadLedger.fulfilled.match(action),
    effect: (_action, api) => {
      if (lifetime.signal.aborted) return
      repository
        .save(toSnapshot(api.getState().ledger.present))
        .catch((error: unknown) => {
          console.error('Saving the budget data failed:', error)
        })
    },
  })

  return {
    store,
    /** Loads the ledger from the repository. */
    load() {
      void store.dispatch(loadLedger())
    },
    /** Aborts what the store started and removes its listeners. The store itself goes with the mount. */
    dispose() {
      lifetime.abort()
      store.dispatch(clearAllListeners())
    },
  }
}

export type AppStore = ReturnType<typeof createBudgetStore>['store']
export type AppDispatch = AppStore['dispatch']

/** addListener typed for this store, for hooks that react to actions (the undo toast). */
export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
