/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** A public Mapbox token for the map and place names (see .env.example). Unset: the map shows a message. */
  readonly VITE_MAPBOX_TOKEN?: string
}
