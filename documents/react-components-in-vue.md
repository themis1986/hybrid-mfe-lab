# React components in Vue: the custom-element bridge

The Vue MFE renders `@repo/ui`'s React components as `<t-*>` custom elements. This document covers:
- why the repo works this way ("Option A");
- how a bridged element works;
- the rules for passing props, events and content across the boundary;
- how the styles get there;
- what the approach costs.

**Contents**
1. [The decision: one library, bridged](#1-the-decision-one-library-bridged)
2. [How a `<t-*>` element works](#2-how-a-t--element-works)
3. [Light DOM, not shadow DOM](#3-light-dom-not-shadow-dom)
4. [Crossing the boundary](#4-crossing-the-boundary)
5. [Styles across the boundary](#5-styles-across-the-boundary)
6. [Costs](#6-costs)
7. [Checklist: exposing a component to Vue](#7-checklist-exposing-a-component-to-vue)

For the tokens, Tailwind setup and component recipe, see [design-system.md](design-system.md). For the runtime walkthrough of the whole repo, see [how-it-works.md](how-it-works.md).

---

## 1. The decision: one library, bridged

A design system serving a React shell and a Vue MFE can take one of two shapes. They are alternatives, not layers to combine.

| | **A: one React library, bridged** (this repo) | **B: two native libraries** |
|---|---|---|
| Packages | `packages/ui`: React + Radix + Tailwind | a React library (Radix) and a Vue library (Reka UI), sharing the tokens |
| Implementations per component | one | two |
| Visual consistency | guaranteed: the same code renders everywhere | by discipline: the same tokens, two implementations |
| In Vue templates | custom elements: props as attributes or properties, DOM events, no slots, no `v-model` | native components: typed props, slots, `v-model` |
| Extra runtime in the Vue app | a copy of React (until React is shared) | none |

**Choosing.**

| If… | Choose |
|---|---|
| the component set stays small or simple, and one source of truth matters most | A |
| many complex inputs and overlays are coming, or many Vue MFEs | B |
| unsure | start with A; add a Vue library only when the bridge starts to hurt |

**Why A here.** The component set is small, and A keeps one implementation of each component. It also builds on the custom-element bridge the skeleton had already proved.

**Why it is cheap to reverse.**
- **Same foundations.** The tokens and the Tailwind setup are the same in both designs.
- **One component at a time.** A single component can later move to a native Vue implementation without affecting the others.
- **Keep the tags contained.** The move stays cheap as long as `<t-*>` tags appear in few files. A thin local Vue wrapper around a `<t-*>` tag keeps the switch to a one-file change.

## 2. How a `<t-*>` element works

`packages/ui/src/register.ts` turns each React component into a custom element class with `@r2wc/react-to-web-component`:

```ts
define('t-<name>', r2wc(bridge(T<Name>), { props: { … } }))
```

| Step | What r2wc does |
|---|---|
| element created (`constructor`) | reads the declared attributes and parses them into props |
| inserted into the page (`connectedCallback`) | `createRoot(element)`, then renders `<T<Name> {...props} />` **inside the element** |
| declared attribute or property changes | updates the props and re-renders |
| removed from the page (`disconnectedCallback`) | `root.unmount()` |

The DOM that results:

```
<t-name label="…">          ← the custom element: Vue owns it (attributes, listeners)
  <button class="…">…</button>   ← rendered by the MFE's copy of React
</t-name>
```

- `register.ts` runs once, when `apps/todo-mfe/src/mount.ts` imports `@repo/ui/register`. That happens before the Vue app mounts, so every tag is already defined when Vue first creates it.
- `define()` skips a tag that is already registered, so a second evaluation doesn't throw. That can happen through HMR, or when several MFEs bundle the entry.
- Vue's compiler leaves `t-*` tags alone (`isCustomElement` in `apps/todo-mfe/vite.config.ts`); otherwise it would try to resolve them as Vue components.

## 3. Light DOM, not shadow DOM

The elements render into their own children (r2wc's `shadow` option is unset):

- **Global CSS reaches them.** One stylesheet on the page styles the inside of every element. With a shadow root, each root would need its own copy of the stylesheet.
- **Radix portals keep working.** Dialogs, popovers and menus portal into `document.body`, and the same global stylesheet styles them there. From inside a shadow root, portalled content would leave the shadow root's styles behind.
- **Events behave normally.** They bubble out with ordinary targets.

The trade-offs: no slots, because React owns the element's children; and page CSS can reach inside, which is fine here because the page and the library share the same tokens.

## 4. Crossing the boundary

### 4.1 Props

- **Only declared props cross.** Only props listed in `r2wc(…, { props })` reach the component.
- **Each prop is two things.** It is an attribute, in kebab-case (`someProp` → `some-prop`), and also a DOM property.
- **Types.** The declared type (`'string'`, `'number'`, `'boolean'`, `'json'`, `'function'`, `'method'`) says how attribute text is parsed.
- **Vue sets properties.** For a custom element, Vue sets a binding as a DOM property whenever the element has a property with that name. Declared props do, because the tags are defined before Vue renders.
- **Writes are reflected.** r2wc writes string, number, boolean and JSON properties back to the attribute, so the DOM inspector shows current values.

### 4.2 Booleans

r2wc's boolean transform converts the value to `"true"`/`"false"` when it is set, and parses attribute text with `/^[ty1-9]/i`. An empty attribute value is ignored.

| In a Vue template | The prop |
|---|---|
| `:flag="true"` | `true` |
| `flag="true"` | `true` |
| `:flag="false"` | `false` |
| bare `flag` (HTML boolean style) | **`false`**: the value is an empty string |

Bind booleans (`:flag="true"`), never rely on a bare attribute. The host also keeps the reflected attribute, for example `flag="false"`, so don't style hosts with `[flag]` attribute selectors.

### 4.3 The `container` prop

r2wc passes one extra prop to every component: `container`, the element itself. `bridge()` in `register.ts` removes it before rendering. Without that, a component that spreads `...props` onto its DOM element would pass `container` on as an unknown attribute.

### 4.4 Events

- **Native events need no mapping.** Events such as `click`, `focus` or `keydown` bubble out of the element, so `@click` on the host just works. Don't map their React handlers (`onClick`) in r2wc's `events`: r2wc would dispatch a second, synthetic event with the same name, and the handler would run twice.
- **Non-native callbacks go through `events`.**
  - `events: { onValueChange: {} }` turns that prop into a function that dispatches `new CustomEvent('valuechange', { detail })` on the host. The name drops `on` and is lower-cased.
  - Listen with `@valuechange` and read `$event.detail`.
  - Pass `{ bubbles: true }` as the `EventInit` if an ancestor needs to hear it.
- **Disabled components must not use `pointer-events: none`.** The click would fall through to the host, and Vue's listener would fire (see [design-system.md](design-system.md#5-the-component-recipe)).

### 4.5 Content

Text and other content go through props. In light DOM, React replaces the element's child nodes, so anything placed between the tags is never shown. Components therefore accept visible text as a prop.

### 4.6 `v-model`

Vue's `v-model` doesn't work on custom elements. Wire it by hand from a value prop and a change event:

```vue
<t-name :value="model" @valuechange="model = $event.detail"></t-name>
```

The React component has to support being controlled (`value` plus `onValueChange`). Declare `value` in `props` and `onValueChange` in `events`. A small Vue wrapper with `defineModel` can hide this wiring behind a normal `v-model`.

### 4.7 Compound components

Radix's compound APIs (a root, a trigger, content, items) are composed from React children, and children don't cross the boundary. For the custom element, design a **flat API**:
- the data comes in a `json` prop (for example a list of options);
- one event reports the result;
- the element renders the compound parts internally.

The React export can keep the composable API for React consumers. These are the components where Option B starts to pay off.

## 5. Styles across the boundary

There are two consumers and two ways to deliver the same stylesheet (details in [design-system.md](design-system.md#7-one-stylesheet-two-deliveries)):
- **React hosts** import the file: `import '@repo/ui/styles.css'`.
- **Custom-element hosts** get the CSS from `@repo/ui/register`, which carries it as a string and writes it into `<style id="t-ui-styles">` before defining any element.

**Why `register` carries its own CSS.**
- **The remote is independent.** It is deployed separately, and it runs both standalone and inside hosts that may not load the stylesheet. It can't count on its host.
- **Federation doesn't carry CSS by default.** In the MFE's production build, a CSS import becomes a separate asset next to the remote's chunks. `@module-federation/vite` doesn't process CSS assets unless `bundleAllCSS` is turned on. Relying on it would also make dev mode (where Vite injects CSS from JavaScript) behave differently from production.
- **A string travels with the code.** CSS inlined in the JavaScript arrives wherever the elements do, and standalone, hosted, dev and production all behave the same.

**One `<style>` per page.** `register.ts` reuses `#t-ui-styles` if it exists and always refreshes its content. A second evaluation, such as an HMR update, therefore replaces the CSS instead of adding another copy.

**Duplication on the shell's page.**
- On `/todo-app`, the page holds both the shell's `styles.css` and the MFE's injected copy.
- When both come from the same ui version they are identical, so the result looks the same and the cost is only bytes.
- The injected `<style>` stays after the MFE unmounts. That is harmless for the same reason.

**Version skew.**
- Host and remote are deployed independently, so they can carry different ui versions.
- Both stylesheets apply to the whole page, in the same cascade layers. When specificity is equal, the later one wins, and the remote's `<style>` comes after the shell's.
- A remote built against a different ui version can therefore change tokens or utilities for the shell's own components too.
- Keep ui versions aligned across deploys. Alternatively, serve one versioned stylesheet that host and remotes share; that is the same kind of optimisation as sharing React (section 6).

## 6. Costs

| Cost | Where it shows | Mitigation |
|---|---|---|
| A second copy of React and react-dom in the remote | the remote's chunk size | federation `shared` with React as a singleton (planned). The element's `root.unmount()` then runs during the shell's commit and must be deferred ([how-it-works.md §6](how-it-works.md#6-two-copies-of-react-on-one-page)). |
| The stylesheet twice on the shell's page | bytes, and the version skew above | one shared stylesheet, later |
| One React root per element | many elements mean many roots | fine for dozens; for long lists, render the list inside one React component |
| Two renderers stacked | debugging: Vue DevTools doesn't see inside a `<t-*>`, and React DevTools shows each element as a separate root | inspect the element's DOM; it is light DOM |
| Flat APIs and hand-wired `v-model` | Vue ergonomics | move that component to Option B if it hurts |

## 7. Checklist: exposing a component to Vue

1. **The React side exists.** The component is built and exported following [design-system.md](design-system.md#8-adding-a-component).
2. **`register.ts`:**
   - declare every prop the element accepts, with its r2wc type;
   - put non-native callbacks in `events`, and never native ones;
   - wrap the component with `bridge()`, and register it with `define('t-<name>', …)`.
3. **The API fits the boundary:**
   - visible text is a prop;
   - booleans are declared `'boolean'`;
   - compound components get a flat API.
4. **In Vue templates:**
   - use `<t-<name>>`;
   - bind booleans (`:flag="true"`);
   - listen to native events directly and to custom events by their lower-case name;
   - wire `v-model` by hand.
5. **Verify** the element both standalone (`:5174`) and inside the shell (`:5173/todo-app`).
