/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** A public Mapbox token for the map demo (see .env.example). Unset: the demo shows a message. */
  readonly VITE_MAPBOX_TOKEN?: string
}
