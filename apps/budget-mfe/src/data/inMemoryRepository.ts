import type { BudgetRepository, LedgerSnapshot } from './repository'

// Holds the ledger for as long as the mount lasts. The short delay stands in for a request, so the loading
// state is the one a real backend would show.
export function createInMemoryRepository(
  createLedger: () => LedgerSnapshot,
  latencyMs = 250,
): BudgetRepository {
  let ledger: LedgerSnapshot | null = null

  return {
    load(signal) {
      return new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(signal.reason)
          return
        }
        const timer = setTimeout(() => {
          ledger ??= createLedger()
          resolve(ledger)
        }, latencyMs)
        signal.addEventListener('abort', () => {
          clearTimeout(timer)
          reject(signal.reason)
        })
      })
    },
    save(next) {
      ledger = next
      return Promise.resolve()
    },
  }
}
