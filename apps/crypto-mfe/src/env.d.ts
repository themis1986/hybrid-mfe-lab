/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** An optional CoinGecko Demo API key (see .env.example). Unset: the keyless API, at about 5 calls a minute. */
  readonly VITE_COINGECKO_API_KEY?: string
}
