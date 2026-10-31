import r2wc from '@r2wc/react-to-web-component'
import { type ComponentType, createElement } from 'react'
import styles from './styles/index.css?inline'
import { TButton } from './components/TButton'
import { TField } from './components/TField'
import { TInput } from './components/TInput'
import { TSwitch } from './components/TSwitch'
import { TDivider } from './components/TDivider'
import { TSpacer } from './components/TSpacer'

// Wraps the React components as custom elements so non-React apps (e.g. Vue) can use them:
//   <t-button label="Save" variant="soft" @click="..."></t-button>

// The stylesheet ships inside this entry: a federated remote can't count on its host, or on the
// federation runtime, to load a CSS file for it. One <style> per page, refreshed if this module re-runs (HMR).
// It is injected before any element is defined, so the first render is already styled.
const STYLE_ID = 't-ui-styles'
const style = document.getElementById(STYLE_ID) ?? document.head.appendChild(document.createElement('style'))
style.id = STYLE_ID
// A divider and a spacer only work as direct children of their flex or block parent, so their hosts
// step out of the layout (`display: contents`). A class on the host itself then has no effect.
style.textContent = `${styles}\nt-divider, t-spacer { display: contents; }`

// r2wc passes the element itself as a `container` prop. Drop it, so components that spread their
// props onto a DOM element don't render it as an attribute.
function bridge<P extends object>(Component: ComponentType<P>) {
  return ({ container: _container, ...props }: P & { container?: HTMLElement }) =>
    createElement(Component, props as P)
}

// Guard against double registration (HMR, or several MFEs bundling this entry).
function define(tag: string, element: CustomElementConstructor) {
  if (!customElements.get(tag)) {
    customElements.define(tag, element)
  }
}

// Clicks need no r2wc `events` mapping: the native `click` from the inner <button> bubbles
// out of <t-button>. Mapping `onClick` would dispatch a second, synthetic `click` event.
// Booleans are parsed from the attribute text: bind them (Vue `:disabled="true"`). A bare `disabled`
// attribute is an empty string, which r2wc reads as false.
define(
  't-button',
  r2wc(bridge(TButton), {
    props: { label: 'string', variant: 'string', size: 'string', disabled: 'boolean' },
  }),
)

// Inputs: the native `input` / `change` events bubble out of the element, and `$event.target` is
// the inner <input> (light DOM). The value is a string prop: bind it and update it on `input`.
const inputProps = {
  value: 'string',
  type: 'string',
  name: 'string',
  placeholder: 'string',
  size: 'string',
  invalid: 'boolean',
  disabled: 'boolean',
} as const

define('t-input', r2wc(bridge(TInput), { props: inputProps }))
define(
  't-field',
  r2wc(bridge(TField), {
    props: { ...inputProps, label: 'string', description: 'string', error: 'string' },
  }),
)

// The switch reports changes through a callback, not a native event: `onCheckedChange` becomes a
// `checkedchange` CustomEvent whose `detail` is the new boolean. Bind `checked` and update it on that event
// (`:checked="on" @checkedchange="on = $event.detail"`). Name it with `aria-label`.
define(
  't-switch',
  r2wc(bridge(TSwitch), {
    props: {
      checked: 'boolean',
      name: 'string',
      size: 'string',
      required: 'boolean',
      disabled: 'boolean',
      'aria-label': 'string',
    },
    events: { onCheckedChange: { bubbles: true } },
  }),
)

// Content-free layout pieces: no children cross the bridge, so only these two are registered.
define('t-divider', r2wc(bridge(TDivider), { props: { orientation: 'string' } }))
define('t-spacer', r2wc(bridge(TSpacer)))
