/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The mock accounts, a JSON array (see apps/shell/.env.example). */
  readonly VITE_MOCK_ACCOUNTS?: string
  /** Where the kanban remote's entry is served from; vite.config.ts reads it at build time. */
  readonly VITE_KANBAN_REMOTE_URL?: string
  /** Where the crypto remote's entry is served from; vite.config.ts reads it at build time. */
  readonly VITE_CRYPTO_REMOTE_URL?: string
  /** Where the budget remote's entry is served from; vite.config.ts reads it at build time. */
  readonly VITE_BUDGET_REMOTE_URL?: string
}
