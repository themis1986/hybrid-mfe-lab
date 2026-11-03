// The map fills its parent: the caller gives the parent (or this root, through its class) a size.
export const tMapViewClasses =
  'relative box-border block size-full overflow-hidden'

// The engine's container: kept empty, as the engine requires; markers and popups go inside it.
export const tMapViewCanvasClasses = 'absolute inset-0'

// Shown in the map's place when no access token is set.
export const tMapViewMessageClasses =
  'box-border flex size-full items-center justify-center rounded-md border border-dashed border-line bg-surface p-6 text-center font-sans text-sm text-fg-muted'
