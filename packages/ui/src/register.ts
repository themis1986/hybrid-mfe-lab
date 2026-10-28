import r2wc from '@r2wc/react-to-web-component'
import { Button } from './Button'

// Wraps the React components as custom elements so non-React apps (e.g. Vue) can use them:
//   <ui-button label="Save" @click="..."></ui-button>
//
// Clicks need no r2wc `events` mapping: the native `click` from the inner <button> bubbles
// out of <ui-button>. Mapping `onClick` would dispatch a second, synthetic `click` event.
const UiButton = r2wc(Button, {
  props: { label: 'string' },
})

// Guard against double registration (HMR, or several MFEs bundling this entry).
if (!customElements.get('ui-button')) {
  customElements.define('ui-button', UiButton)
}
