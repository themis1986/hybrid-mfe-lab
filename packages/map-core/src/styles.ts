import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css?inline'

// The engine's own stylesheet (controls, markers, popups) travels inside the JavaScript, like a remote's
// CSS: no host has to load a CSS file for it. It goes in the `components` layer, so the libraries' token
// utilities (in `utilities`) win over its rules. It stays once added: maps of several bundles share it.
const STYLE_ID = 't-map-styles'

export function ensureMapStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `@layer components {\n${mapboxStyles}\n}`
  document.head.appendChild(style)
}
