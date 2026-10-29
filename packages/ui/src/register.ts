import r2wc from '@r2wc/react-to-web-component'
import { type ComponentType, createElement } from 'react'
import styles from './styles/index.css?inline'
import { TButton } from './components/TButton'
import { TField } from './components/TField'
import { TInput } from './components/TInput'

// Wraps the React components as custom elements so non-React apps (e.g. Vue) can use them:
//   <t-button label="Save" variant="soft" @click="..."></t-button>

// The stylesheet ships inside this entry: a federated remote can't count on its host, or on the
// federation runtime, to load a CSS file for it. One <style> per page, refreshed if this module re-runs (HMR).
// It is injected before any element is defined, so the first render is already styled.
const STYLE_ID = 't-ui-styles'
const style = document.getElementById(STYLE_ID) ?? document.head.appendChild(document.createElement('style'))
style.id = STYLE_ID
style.textContent = styles

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
