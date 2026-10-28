# The design system: tokens, Tailwind and `T` components

How `@repo/ui` turns design tokens into styled, Radix-based React components, and how those components and their styles reach both apps. For how the Vue app renders them as custom elements, see [react-components-in-vue.md](react-components-in-vue.md).

**Contents**
1. [Where it lives](#1-where-it-lives)
2. [The pipeline at a glance](#2-the-pipeline-at-a-glance)
3. [Design tokens](#3-design-tokens)
4. [The Tailwind layer](#4-the-tailwind-layer)
5. [The component recipe](#5-the-component-recipe)
6. [Naming conventions](#6-naming-conventions)
7. [One stylesheet, two deliveries](#7-one-stylesheet-two-deliveries)
8. [Adding a component](#8-adding-a-component)
9. [Things worth knowing](#9-things-worth-knowing)

For setup and commands, see the [README](../README.md).

---

## 1. Where it lives

Everything is in one package, `packages/ui`. There is one implementation of each component: React, with Radix for behaviour and Tailwind for styling. The Vue MFE doesn't get a second, Vue-native copy. It uses the same components through custom elements. This is "Option A"; the reasoning and its limits are in [react-components-in-vue.md](react-components-in-vue.md#1-the-decision-one-library-bridged).

```
packages/ui/src/
  styles/tokens.css    design tokens: plain CSS custom properties (--t-*)
  styles/index.css     the library stylesheet: Tailwind (no Preflight) + tokens + the token → utility bridge
  lib/cn.ts            class-name helper (clsx + tailwind-merge)
  T<Name>.tsx          one file per component
  index.ts             entry ".":          the React components (and the stylesheet, for the build)
  register.ts          entry "./register": the stylesheet, injected + each component as a <t-*> custom element
  env.d.ts             Vite's types, for the .css and ?inline imports
```

## 2. The pipeline at a glance

```mermaid
graph LR
  tokens["tokens.css<br/>--t-&lt;hue&gt;-&lt;step&gt; → --t-color-&lt;role&gt;"] --> index["index.css<br/>@theme inline bridge"]
  index --> tw["Tailwind utilities<br/>bg-&lt;role&gt;, text-&lt;role&gt;, rounded-md …"]
  tw --> comp["T&lt;Name&gt;.tsx<br/>cva variants + Radix"]
  index --> css["dist/styles.css<br/>(React hosts import it)"]
  index --> inline["inlined in dist/register.js<br/>(injected as &lt;style&gt;)"]
```

- Tokens are plain CSS variables. They work with or without Tailwind.
- Tailwind is the authoring tool *inside* the package. Its utilities resolve to the tokens.
- Components only ever use token-backed utilities, never raw colours.
- One stylesheet (`index.css`) is built into two forms, so React hosts and custom-element hosts both get it (see [section 7](#7-one-stylesheet-two-deliveries)).

## 3. Design tokens

### 3.1 Two tiers

| Tier | Naming | Example | Who uses it |
|---|---|---|---|
| 1. Primitive | `--t-<hue>-<step>` | `--t-iris-9` | Only tier 2. Components never reference a primitive. |
| 2. Semantic | `--t-color-<role>`, `--t-radius-*`, `--t-font-*`, `--t-shadow-*`, `--t-ease-*` | `--t-color-accent` | The Tailwind bridge, and therefore every component. |

The semantic roles fall into four groups:
- **surfaces and text**: the page canvas, raised surfaces, foreground, muted foreground, lines;
- **accent**: solid fill and its hover, the text colour on top of it, subtle fills, the accent line and accent text;
- **danger**: the same solid trio, in red;
- **focus**: the focus-ring colour.

A component asks for a *role* ("accent fill"), never a *colour* ("iris 9"). Swapping the brand colour is therefore a change to tier 2 only.

### 3.2 The palette and why

The colour scales are [Radix Colors](https://www.radix-ui.com/colors) (MIT), vendored as hex values into `tokens.css`:

| Scale | Role | Why |
|---|---|---|
| Iris | accent | A calm blue-violet that reads well both as a solid fill and as text. |
| Slate | neutrals | Radix's natural pairing for Iris: a cool grey with a hint of the same hue. |
| Red | danger | Built on the same 12-step model, so its steps line up with the other two. |

What makes the system work is that **every step has a fixed job**, the same in every scale and in both themes ([Radix: understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)):

| Steps | Job |
|---|---|
| 1–2 | app and subtle backgrounds |
| 3–5 | component fills: normal, hover, pressed |
| 6–8 | borders and separators; 8 also serves as the focus ring |
| 9–10 | solid fills and their hover state |
| 11–12 | low- and high-contrast text |

The scales are tuned with the APCA contrast model: text on steps 11–12 over the step 1–2 backgrounds is designed to stay readable in both themes. Mapping each role to the step with the matching job keeps that guarantee. The type tokens are system font stacks. A web font would need its own delivery story across federation (see [section 9](#9-things-worth-knowing)).

### 3.3 Light and dark

- **Tier 1 switches.** Light values sit on `:root`, and dark values sit in `@media (prefers-color-scheme: dark)`.
- **Tier 2 mostly doesn't.** Because each step keeps its job in both themes, the semantic aliases stay the same. The only exception is the canvas: white in light mode, step 1 of the neutral in dark mode, as Radix recommends.
- `:root` sets `color-scheme: light dark`, so native parts (scrollbars, default form controls, the page's default canvas) follow too.

Components contain no `dark:` classes. They switch automatically because the tokens underneath them do.

### 3.4 Re-theming

`tokens.css` is imported into the `base` cascade layer. Any unlayered CSS beats layered CSS, so a host can re-theme without touching the package:

```css
/* in a host's own stylesheet */
:root { --t-color-accent: #0d74ce; }
```

## 4. The Tailwind layer

`styles/index.css` is the only file Tailwind compiles. In order, it does the following.

**Declares the layer order.**

```css
@layer theme, base, components, utilities;
```

**Imports Tailwind without Preflight.**

```css
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities) source('..');
```

- Preflight is Tailwind's CSS reset. It is deliberately left out: a component library must not reset the page it is loaded into, and the Vue MFE runs inside the shell's page. The price is that components reset the browser's defaults for their own elements (see [section 5](#5-the-component-recipe)).
- `source('..')` limits class scanning to `packages/ui/src`.

**Imports the tokens** into `layer(base)` (see [section 3.4](#34-re-theming)).

**Bridges tokens to utilities** with `@theme inline`:

```css
@theme inline {
  --color-*: initial;                       /* drop Tailwind's default palette */
  --color-<role>: var(--t-color-<role>);    /* one line per semantic colour */
  --radius-md: var(--t-radius-md);          /* standard Tailwind names, token values */
  --font-sans: var(--t-font-sans);
}
```

- `--color-*: initial` removes every default colour, so `bg-<role>` exists and `bg-red-500` does not. Off-system colours fail visibly instead of slipping in.
- `inline` makes utilities emit `var(--t-…)` directly (`.bg-accent { background-color: var(--t-color-accent) }`), so they follow the tokens wherever those are redefined.
- Radius, font, shadow and easing keep Tailwind's standard names (`rounded-md`, `font-sans` and so on). `tailwind-merge` only knows the standard scales, so this is what lets it resolve conflicts without extra configuration.

**Applies the tokens to the page** in a small `base` rule for `body`: font, canvas background, foreground colour, font smoothing. This is the only page-level styling the library ships.

## 5. The component recipe

Each `T<Name>.tsx` follows the same shape.

**Behaviour comes from Radix.** Radix Primitives has no Button primitive. For a component that is "an element plus styles", the recipe is a native element plus [Radix `Slot`](https://www.radix-ui.com/primitives/docs/utilities/slot):

```tsx
const Comp = asChild ? Slot : 'button'
```

- By default it renders the native element, so it gets native keyboard, form and accessibility behaviour.
- With `asChild`, `Slot` renders the caller's single child instead and merges the component's classes, handlers and ref onto it, for example to style a router link.

For components with real behaviour (dialogs, selects, tabs), the recipe wraps the matching Radix primitive package instead.

**Styles come from `cva`.**

```tsx
const tNameVariants = cva('<base classes>', {
  variants: { variant: { … }, size: { … } },
  defaultVariants: { … },
})
```

- `class-variance-authority` maps variant props to class strings, and `VariantProps<typeof tNameVariants>` turns them into typed props.
- The final class is `cn(tNameVariants({ … }), className)`. `cn` (`lib/cn.ts`) is `twMerge(clsx(…))`, so a caller's `className` wins conflicts instead of depending on stylesheet order.
- **Base classes reset browser defaults.** Without Preflight, a native button keeps its UA border, font and cursor unless the component sets them.
- **Disabled uses the native attribute**, not `pointer-events: none`. A natively disabled button dispatches no click at all. With `pointer-events: none` the click falls through to whatever is underneath. In Vue that is the `<t-*>` host element, whose inline box spans the middle of the button and where Vue's listener sits, so a disabled component would still fire. Hover styles are scoped with `not-disabled:` instead.
- **Text content also has a prop.** A custom element can't pass React children, so components that show text accept it as a prop, with `children` taking precedence in React.

## 6. Naming conventions

| Thing | Pattern | Notes |
|---|---|---|
| React component | `T<Name>` | the package's public export |
| Props type | `T<Name>Props` | exported as a type |
| Custom element | `<t-<name>>` | the kebab-case of `T<Name>`, defined in `register.ts` |
| Design tokens | `--t-*` | primitives `--t-<hue>-<step>`, semantics `--t-color-<role>` and so on |
| Injected stylesheet | `<style id="t-ui-styles">` | one per page (see [react-components-in-vue.md](react-components-in-vue.md#5-styles-across-the-boundary)) |

The Vue compiler treats every `t-*` tag as a custom element (`isCustomElement` in `apps/todo-mfe/vite.config.ts`), so the `t-` prefix is reserved for design-system elements in Vue templates.

## 7. One stylesheet, two deliveries

| Consumer | How it gets the CSS | Built by |
|---|---|---|
| React host (the shell) | `import '@repo/ui/styles.css'` once, in its entry | `index.ts` imports `styles/index.css`; Vite library mode extracts it to `dist/styles.css` (`build.lib.cssFileName: 'styles'`) and removes the import from the JavaScript. |
| Custom-element host (the MFE) | nothing to do: `import '@repo/ui/register'` brings it | `register.ts` imports `styles/index.css?inline`, a string compiled by the same Tailwind plugin, and writes it into one `<style>` before defining any element. |

Why the custom-element path can't just use the CSS file is explained in [react-components-in-vue.md](react-components-in-vue.md#5-styles-across-the-boundary).

Build details:
- `@tailwindcss/vite` runs in ui's `vite.config.ts`. It compiles `.css` and `.css?inline` alike; it skips only `?raw`, `?url` and `?worker`.
- In `vite build --watch`, Tailwind registers every scanned source file as a watch dependency. A new class in a `.tsx` file therefore rebuilds both `dist/styles.css` and the string inside `dist/register.js`.
- `package.json` exports `./styles.css`, and lists `./dist/styles.css` in `sideEffects` so a bundler never drops the bare import.
- Tailwind is a **devDependency** of ui: apps never run Tailwind themselves. The runtime helpers (`@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`) are ui `dependencies` and are kept external in the library build, so each app bundles them, like `react`.

## 8. Adding a component

1. **Tokens.** If the component needs a role that doesn't exist yet, add `--t-color-<role>` to tier 2 in `tokens.css` (pointing at a primitive step with the right job), and its `--color-<role>` line to `@theme inline` in `index.css`.
2. **Component.** Create `src/T<Name>.tsx`:
   - for behaviour, use a native element plus `Slot`, or the matching Radix primitive (install it as a ui `dependency` through the catalog);
   - write its variants with `cva`, using only token-backed utilities, and merge `className` through `cn`;
   - give any visible text a prop as well as `children`.
3. **Export it.** Add `T<Name>` and `T<Name>Props` to `src/index.ts`.
4. **Bridge it.** In `src/register.ts`, `define('t-<name>', r2wc(bridge(T<Name>), { props: { … } }))`. Declare every prop the custom element should accept, with its r2wc type. The bridge rules (booleans, events, content, compound components) are in [react-components-in-vue.md](react-components-in-vue.md#4-crossing-the-boundary).
5. **New runtime dependency?** Add it to `external` in `packages/ui/vite.config.ts` as well.
6. **Check** `pnpm build` and `pnpm typecheck`, then look at the component in the shell and in the MFE, in both colour schemes.

## 9. Things worth knowing

- **Only classes used in `packages/ui/src` exist.** The apps don't run Tailwind, so a Tailwind class written in an app's own markup does nothing. App layout uses the app's own CSS.
- **The scanner reads words, not code.** Any word in `src` that happens to be a utility name produces that utility, for example a variant key that is also a utility name. This is harmless (a few unused rules) but explains surprises in `dist/styles.css`.
- **`transition-colors` includes `outline-color`.** A focus ring therefore fades in over the transition duration rather than appearing instantly.
- **Fonts are system stacks.** A web font would need its files served from somewhere both the shell and a federated remote can reach. `url()`s in the inlined CSS resolve against the *page*, not the remote. Decide the hosting before adding one.
- **Colours are sRGB hex.** Radix also publishes Display-P3 versions of each scale. Adding them is a tier-1-only change inside an `@supports (color: color(display-p3 1 1 1))` block.
