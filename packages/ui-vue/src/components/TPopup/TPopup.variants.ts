// Set on the engine's popup root: the content box on the token surface, no tip (its colour is set per
// anchor by the engine's CSS). The engine's rules sit in a lower cascade layer, so these win.
export const tPopupClasses =
  'font-sans text-sm text-fg [&_.mapboxgl-popup-content]:rounded-md [&_.mapboxgl-popup-content]:border [&_.mapboxgl-popup-content]:border-line [&_.mapboxgl-popup-content]:bg-canvas [&_.mapboxgl-popup-content]:py-2 [&_.mapboxgl-popup-content]:ps-3 [&_.mapboxgl-popup-content]:pe-7 [&_.mapboxgl-popup-content]:shadow-lg [&_.mapboxgl-popup-tip]:hidden [&_.mapboxgl-popup-close-button]:text-fg-muted'
