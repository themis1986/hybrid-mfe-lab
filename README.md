# Microfrontends monorepo skeleton

A React shell that loads Vue microfrontends at runtime with Module Federation, on one token-based design
system (Tailwind v4) delivered as two native component libraries: React (Radix) and Vue (Reka UI), sharing
the tokens. One remote still renders the React library as custom elements, until it moves to the Vue
library. Placeholder content only; this skeleton just proves the pieces fit together.

For a step-by-step explanation of how everything connects at build time and at runtime, see
[documents/how-it-works.md](documents/how-it-works.md). If Module Federation is new to you, start with
[documents/module-federation-explained.md](documents/module-federation-explained.md), a beginner's guide
to the federation configuration. For what the `.d.ts` files are for, see
[documents/typescript-declaration-files.md](documents/typescript-declaration-files.md). New to the repo?
[documents/monorepo-tooling.md](documents/monorepo-tooling.md) explains pnpm, Turborepo and what
`pnpm dev` actually runs. The design system (tokens, Tailwind, the React and Vue component recipes) is
described in [documents/design-system.md](documents/design-system.md), and the custom-element bridge that
first brought it to Vue, with the reasoning behind moving to two libraries, in
[documents/react-components-in-vue.md](documents/react-components-in-vue.md).

## Architecture

```
                      browser: http://localhost:5173
┌──────────────────────────────────────────────────────────────────────┐
│ apps/shell  (@repo/shell)            React 19 + React Router 8       │
│   frame, menu, own routes: React components from @repo/ui            │
│   /<base>/*   a host per remote (createRemoteHost)                   │
│                 └─ import('<remote>/mount') ──────────┐ runtime,     │
│                    mount(div, { basePath })           │ federation   │
└───────────────────────────────────────────────────────┼──────────────┘
                         ┌──────────────────────────────┴──────────┐
                         ▼                                         ▼
  :5174/remoteEntry.js (served separately)  :5175/remoteEntry.js (served separately)
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│ apps/todo-mfe   Vue 3            │  │ apps/ui-vue-docs   Vue 3         │
│   exposes "./mount"              │  │   exposes "./mount"              │
│   t-* custom elements from       │  │   components from @repo/ui-vue   │
│   @repo/ui/register (for now)    │  │   stylesheet injected inline     │
└──────────────────────────────────┘  └──────────────────────────────────┘

packages/tokens  (@repo/tokens)  design tokens + the token → Tailwind theme (CSS only)
packages/ui      (@repo/ui)      T-prefixed React components (Radix + Tailwind), styles.css, and a
                                  "register" entry that defines them as t-* custom elements
packages/ui-vue  (@repo/ui-vue)  the same components natively in Vue (Reka UI + Tailwind), styles.css
packages/config  (@repo/config)  shared tsconfig presets (base, react, vue, node)
```

- The shell imports no Vue code. It only knows the `mount` contract (typed in `apps/shell/src/remotes.d.ts`).
- A remote imports nothing from the shell or from another remote. No app imports another's source.
- Each remote is independently buildable and servable, and also runs standalone.

## Running it

Requirements: Node ≥ 22.22 and pnpm 12 (`npm install -g pnpm@12.16.0`; Node 25+ no longer ships corepack).

```sh
pnpm install
pnpm dev         # ui + ui-vue (vite build --watch) + the remotes' and the shell's dev servers
```

| What | URL |
|---|---|
| Shell (open this) | http://localhost:5173 |
| Todo MFE standalone | http://localhost:5174 |
| Todo MFE remote entry | http://localhost:5174/remoteEntry.js |
| Vue UI docs MFE standalone | http://localhost:5175 |
| Vue UI docs MFE remote entry | http://localhost:5175/remoteEntry.js |

Ports are fixed (`strictPort`), so a port that's already in use fails loudly instead of moving.

Other root scripts:

```sh
pnpm build       # build every package (the libraries first, via turbo ^build)
pnpm typecheck   # tsc / vue-tsc in every package
pnpm preview     # production builds served by `vite preview` on the same ports
```

Single packages: `pnpm --filter @repo/todo-mfe dev`, `pnpm --filter @repo/ui build`, and so on.

Module Federation's dev mode works with Vite 8: the remote is served straight by its Vite dev
server, so no `build --watch` + `preview` workaround is needed. `pnpm preview` is the production-like check.

### Remote URLs

The shell reads one variable per remote when it **builds**: `VITE_TODO_REMOTE_URL` (default
`http://localhost:5174/remoteEntry.js`) and `VITE_UI_VUE_DOCS_REMOTE_URL` (default
`http://localhost:5175/remoteEntry.js`). Set them in the environment or in `apps/shell/.env.local`:

```sh
VITE_TODO_REMOTE_URL=https://cdn.example.com/todo/remoteEntry.js pnpm build
```

Turborepo includes these variables (root `turbo.json`, `build.env`) in the shell build's cache key.

## How it works

### Mount contract

Each remote's `src/mount.ts` is exposed as `<remote>/mount`:

```ts
export function mount(el: HTMLElement, props: { basePath: string }): () => void
```

- `mount` creates a Vue app plus a router on `createWebHistory(basePath)`, so the remote's routes are
  relative to its base path, and mounts the app into `el`.
- The returned function calls `app.unmount()` and `history.destroy()`. The second call matters:
  `app.unmount()` doesn't remove Vue Router's `popstate` listener on `window`.
- Each Vue remote sets `app.config.idPrefix`: `useId()` is unique only within one app, and several apps share
  the page.
- In the shell, `createRemoteHost(load, basePath, appName)` (`apps/shell/src/RemoteMfeHost.tsx`) builds each
  remote's host component, which lazy-loads the module with `React.lazy`.
  - `<Suspense>` shows a loading state, and an error boundary shows a fallback if the remote can't be loaded.
  - A `useEffect` calls `mount` on a container ref and returns the unmount function as its cleanup.
  - React StrictMode's dev-only mount → unmount → mount is therefore harmless.
- Each remote's route is a splat (`<base>/*`), so the remote can own deeper URLs without the shell knowing
  about them.

### Two libraries on shared tokens

| Import | For | What it is |
|---|---|---|
| `@repo/tokens/tokens.css` | the libraries' stylesheets | the design tokens (CSS custom properties) |
| `@repo/tokens/theme.css` | any Tailwind build on the design system | the token → utility theme (`@theme inline`) |
| `@repo/ui` + `@repo/ui/styles.css` | React apps | the `T`-prefixed React components and their stylesheet (tokens + utilities, no Preflight) |
| `@repo/ui-vue` + `@repo/ui-vue/styles.css` | Vue apps | the same components natively in Vue, and their stylesheet |
| `@repo/ui/icons`, `@repo/ui-vue/icons` | React / Vue apps | the icon set (Lucide), re-exported, so apps never depend on the icon package themselves |

- The shell imports `@repo/ui/styles.css` once, in `main.tsx`, followed by its own Tailwind stylesheet
  (`src/index.css`: theme and utilities, no Preflight, plus `@repo/tokens/theme.css`).
- A Vue remote on `@repo/ui-vue` bundles `@repo/ui-vue/styles.css` and its own Tailwind utilities into one
  stylesheet, imports it with `?inline`, and injects it as a `<style>` while it is mounted. A federated remote
  can't count on its host or on the federation runtime to load a CSS file for it.
- Both libraries use identical class strings for their variants, so they look the same; a change goes in both.
- **Light and dark.** The page follows the OS until the shell sets `data-theme="light|dark"` on `<html>`. The tokens
  hold both values (`light-dark()`), so the whole page switches, remotes included. The shell stores the choice and
  applies it before the first paint.

### React UI inside Vue: the custom-element bridge (being phased out)

The todo MFE still renders the React library through a third entry point, until it moves to `@repo/ui-vue`:

| Import | For | What it is |
|---|---|---|
| `@repo/ui/register` | any framework | injects the `@repo/ui` stylesheet as one `<style>` and defines each component as a `t-*` custom element with `@r2wc/react-to-web-component` |

The MFE imports `@repo/ui/register` once, in `mount.ts`, and then uses the `t-*` tags in its Vue templates
like native elements. A component `T<Name>` becomes the tag `<t-<name>>`.

- **Vue compiler:** `isCustomElement: (tag) => tag.startsWith('t-')` in `apps/todo-mfe/vite.config.ts`
  makes Vue treat `t-*` tags as native elements.
- **Props:** only the props declared in `r2wc(Component, { props })` reach the React component. Each one is
  available both as an attribute and as a DOM property. Bind booleans (`:flag="true"`): a bare attribute is an
  empty string, which r2wc reads as `false`.
- **Events:** native DOM events (such as `click`) from inside the element bubble out of it, so Vue's `@click`
  just works. Don't map a native event's React handler (e.g. `onClick`) in r2wc's `events` option: it would
  dispatch a second, synthetic event. Use `events` for non-native events (e.g. `onSelect` → `select`).
- **Content:** text and other content go through props. The elements use light DOM, where React replaces any
  child nodes, so anything placed between the tags won't show. Light DOM is deliberate: the page's stylesheet
  reaches inside, and Radix portals keep working.
- **Styles:** `register` carries the CSS inline, because a federated remote can't count on its host or on the
  federation runtime to load a CSS file for it. On the shell's page the stylesheet is therefore present twice
  (identical when both sides use the same ui version).
- **Registration:** each definition is guarded with `customElements.get`, so a double import (HMR, several MFEs)
  doesn't throw. A small `bridge()` wrapper strips the `container` prop that r2wc adds.
- **Bundling:** `@repo/ui` keeps React and its other runtime dependencies external. The MFE has
  `react`/`react-dom` as dependencies, so **the MFE bundles its own copy of React** into the remote's chunk.
  This is accepted for now.

The full rules and trade-offs are in [documents/react-components-in-vue.md](documents/react-components-in-vue.md).
To add a component, follow the checklist in [documents/design-system.md](documents/design-system.md#8-adding-a-component).

### Build details

- `@repo/ui` is built with Vite library mode (ESM, entries `index`, `icons` and `register`), and `tsc` emits its
  `.d.ts` files. `@repo/ui-vue` is built the same way (entries `index` and `icons`), with `vue-tsc` emitting the
  `.d.ts` files. The `icons` entries are bare re-exports of the external Lucide packages, so apps' builds keep only
  the icons they import.
  Apps consume `dist/` through the package `exports`.
- `@repo/tokens` has no build: each library's Tailwind compiles it into its `dist/styles.css`. Each library's
  `turbo.json` lists the tokens as a `build` input, so a token change invalidates the cached build.
- `@tailwindcss/vite` compiles `src/styles/index.css` twice: imported by `index.ts`, it becomes `dist/styles.css`
  (`build.lib.cssFileName`); imported with `?inline` by `register.ts`, it becomes a string inside `register.js`.
- `sideEffects` marks `register.js` and `styles.css`, so the bare imports survive tree-shaking.
- `pnpm dev` builds each library once, then keeps `vite build --watch` running (each library's `turbo.json`
  makes its watcher wait for the first build). The watcher also rebuilds the CSS when a class changes in a component.
  `emptyOutDir: false` stops it from deleting the `.d.ts` files, and chunk names carry no hashes, so stale
  files don't pile up.

## Adding another microfrontend

1. Create `apps/<name>` with its own `package.json` (`@repo/<name>`) and scripts `dev`, `build`, `preview`
   and `typecheck`. Extend the matching `@repo/config` tsconfig preset.
2. Add `@module-federation/vite` with a unique `name`, `filename: 'remoteEntry.js'`, `exposes: { './mount': … }`,
   and a fixed port with `server.origin` set to that port.
3. Implement the same `mount(el, { basePath }) => unmount` contract. A Vue remote uses `@repo/ui-vue`,
   puts its styles in one `src/styles.css` injected inline from `mount.ts` (and removed on unmount), and sets
   `app.config.idPrefix`. A React remote would use `@repo/ui` the same way.
4. In the shell:
   - add the remote to `remotes` in `apps/shell/vite.config.ts` with its own `VITE_*_REMOTE_URL` variable, and
     list that variable in the root `turbo.json` `build.env`;
   - declare its module in `apps/shell/src/remotes.d.ts`;
   - add a host file built with `createRemoteHost`, and its splat route in `App.tsx`;
   - add its entry to the sidebar menu config (`apps/shell/src/navigation.ts`).
5. Turborepo picks up the new app's `dev`, `build`, `typecheck` and `preview` tasks automatically.

## Versions

Checked on npm on 2026-10-28. Ranges live in the pnpm `catalog:` in `pnpm-workspace.yaml`; installed versions:

| Package | Version | | Package | Version |
|---|---|---|---|---|
| pnpm | 12.16.0 | | vue | 3.5.44 |
| turbo | 2.11.10 | | vue-router | 5.4.0 |
| vite | 8.3.5 | | vue-tsc | 3.3.13 |
| typescript | 6.0.3 | | @vitejs/plugin-vue | 6.0.10 |
| react / react-dom | 19.3.1 | | @vitejs/plugin-react | 6.1.2 |
| react-router | 8.5.0 | | @module-federation/vite | 1.23.6 |
| @types/react(-dom) | 19.3.0 | | @r2wc/react-to-web-component | 2.1.1 |
| @types/node | 22.20.5 | | tailwindcss / @tailwindcss/vite | 4.3.3 |
| @radix-ui/react-slot | 1.5.0 | | class-variance-authority | 0.7.1 |
| @radix-ui/react-switch | 1.4.1 | | reka-ui | 2.11.0 |
| clsx | 2.1.1 | | tailwind-merge | 3.7.0 |
| lucide-react | 1.65.0 | | @lucide/vue | 1.65.0 |

### Deviations from the original brief, and why

- **TypeScript 6.0.3, not 7.0.2 (`latest`).** TypeScript 7 (the native compiler) no longer exposes the JS
  compiler API, which `vue-tsc` still needs to typecheck `.vue` files. One TS version for the whole repo is
  simpler than mixing 7 with a TS 6 alias for the Vue app. Revisit once Vue's language tools support TS 7.
- **No root `tsconfig.base.json`.** The shared base is `packages/config/base.json`. Vite 8's built-in tsconfig
  resolver follows `extends` through the pnpm symlink (`node_modules/@repo/config/…`), so a preset reaching
  back to `../../tsconfig.base.json` fails to resolve. `@repo/config` therefore has to be self-contained.
- **pnpm's release-age gate.** pnpm 12 by default refuses versions published less than 24 h ago
  (`minimumReleaseAge`). That's why the repo uses pnpm 12.16.0 and react-router 8.5.0 rather than the
  day-old 12.16.1 and 8.5.1.
- **Additions:** a root `pnpm preview` script, a `turbo.json` in each library, and a `data:` favicon in each
  `index.html` (avoids a console 404).
- **No shared dependencies between host and remote yet** (`shared: {}`). Module Federation `dts` type
  generation is off; the remote's types are hand-written in the shell.
