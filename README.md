# Microfrontends monorepo skeleton

A React shell that loads a Vue microfrontend at runtime with Module Federation. Both apps use one
React `Button` from a shared UI package: the shell renders it directly, and the Vue app renders it as
a custom element. Placeholder content only; this skeleton just proves the pieces fit together.

For a step-by-step explanation of how everything connects at build time and at runtime, see
[documents/how-it-works.md](documents/how-it-works.md).

## Architecture

```
                      browser: http://localhost:5173
┌──────────────────────────────────────────────────────────────────────┐
│ apps/shell  (@repo/shell)            React 19 + React Router 8       │
│   /            HomePage ── <Button> from @repo/ui (plain React)      │
│   /todo-app/*  TodoMfeHost                                           │
│                  └─ import('todo/mount') ─────────────┐ runtime,     │
│                     mount(div, { basePath })          │ federation   │
└───────────────────────────────────────────────────────┼──────────────┘
                                                        ▼
            http://localhost:5174/remoteEntry.js  (served separately)
┌──────────────────────────────────────────────────────────────────────┐
│ apps/todo-mfe  (@repo/todo-mfe)      Vue 3 + Vue Router 5            │
│   exposes "./mount" → src/mount.ts                                   │
│   HomePage.vue ── <ui-button> from @repo/ui/register (custom element)│
└──────────────────────────────────────────────────────────────────────┘

packages/ui      (@repo/ui)      React Button, plus a "register" entry that defines <ui-button>
packages/config  (@repo/config)  shared tsconfig presets (base, react, vue, node)
```

- The shell imports no Vue code. It only knows the `mount` contract (typed in `apps/shell/src/remotes.d.ts`).
- The MFE imports nothing from the shell. Neither app imports the other's source.
- The MFE is independently buildable and servable, and also runs standalone.

## Running it

Requirements: Node ≥ 22.22 and pnpm 12 (`npm install -g pnpm@12.16.0`; Node 25+ no longer ships corepack).

```sh
pnpm install
pnpm dev         # ui (vite build --watch) + todo-mfe dev server + shell dev server
```

| What | URL |
|---|---|
| Shell (open this) | http://localhost:5173 |
| Todo MFE standalone | http://localhost:5174 |
| Todo MFE remote entry | http://localhost:5174/remoteEntry.js |

Ports are fixed (`strictPort`), so a port that's already in use fails loudly instead of moving.

Other root scripts:

```sh
pnpm build       # build every package (ui first, via turbo ^build)
pnpm typecheck   # tsc / vue-tsc in every package
pnpm preview     # production builds served by `vite preview` on the same ports
```

Single packages: `pnpm --filter @repo/todo-mfe dev`, `pnpm --filter @repo/ui build`, and so on.

Module Federation's dev mode works with Vite 8: the remote is served straight by its Vite dev
server, so no `build --watch` + `preview` workaround is needed. `pnpm preview` is the production-like check.

### Remote URL

The shell reads `VITE_TODO_REMOTE_URL` when it **builds**. The default is
`http://localhost:5174/remoteEntry.js`. Set it in the environment or in `apps/shell/.env.local`:

```sh
VITE_TODO_REMOTE_URL=https://cdn.example.com/todo/remoteEntry.js pnpm build
```

Turborepo includes this variable in the shell build's cache key.

## How it works

### Mount contract

`apps/todo-mfe/src/mount.ts` is exposed as `todo/mount`:

```ts
export function mount(el: HTMLElement, props: { basePath: string }): () => void
```

- `mount` creates a Vue app plus a router on `createWebHistory(basePath)`, so MFE routes are relative to
  `/todo-app`, and mounts the app into `el`.
- The returned function calls `app.unmount()` and `history.destroy()`. The second call matters:
  `app.unmount()` doesn't remove Vue Router's `popstate` listener on `window`.
- In the shell, `TodoMfeHost` lazy-loads the module with `React.lazy`.
  - `<Suspense>` shows a loading state, and an error boundary shows a fallback if the remote can't be loaded.
  - A `useEffect` calls `mount` on a container ref and returns the unmount function as its cleanup.
  - React StrictMode's dev-only mount → unmount → mount is therefore harmless.
- `/todo-app/*` is a splat route, so the MFE can own deeper URLs without the shell knowing about them.

### React UI inside Vue: the custom-element bridge

Vue can't render React components, so `@repo/ui` ships two entry points:

| Import | For | What it is |
|---|---|---|
| `@repo/ui` | React apps | the plain `Button` component |
| `@repo/ui/register` | any framework | defines `<ui-button>` with `@r2wc/react-to-web-component` |

The MFE imports `@repo/ui/register` once, in `mount.ts`, and uses the tag in templates:

```vue
<ui-button label="Vue click" @click="clicks++"></ui-button>
```

- **Vue compiler:** `isCustomElement: (tag) => tag.startsWith('ui-')` in `apps/todo-mfe/vite.config.ts`
  makes Vue treat `ui-*` tags as native elements.
- **Props:** declared r2wc props are available both as attributes and as DOM properties (`label: 'string'`).
- **Events:** the native `click` from the inner `<button>` bubbles out of `<ui-button>`, so `@click` just works.
  r2wc's `events` option is deliberately not used for `onClick`: it would dispatch a second, synthetic `click`.
  Use `events` for non-native events (e.g. `onSelect` → `select`).
- **Text:** content goes through the `label` prop. The element uses light DOM, where React replaces any child
  nodes, so `<ui-button>Text</ui-button>` won't show the text. Slot support would need `shadow: 'open'` and a
  `<slot>` in the wrapper.
- **Registration:** guarded with `customElements.get`, so a double import (HMR, several MFEs) doesn't throw.
- **Bundling:** `@repo/ui` keeps React external. The MFE has `react`/`react-dom` as dependencies, so **the MFE
  bundles its own copy of React** (about 300 kB of the remote's chunk). This is accepted for now (see next steps).

### Build details

- `@repo/ui` is built with Vite library mode (ESM, entries `index` and `register`), and `tsc` emits its `.d.ts`
  files. Apps consume `dist/` through the package `exports`.
- `sideEffects` marks `register.js`, so the bare `import '@repo/ui/register'` survives tree-shaking.
- `pnpm dev` builds ui once, then keeps `vite build --watch` running (`packages/ui/turbo.json` makes the watcher
  wait for the first build). `emptyOutDir: false` stops the watcher from deleting the `.d.ts` files, and chunk
  names carry no hashes, so stale files don't pile up.

## Adding another microfrontend

1. Create `apps/<name>` with its own `package.json` (`@repo/<name>`) and scripts `dev`, `build`, `preview`
   and `typecheck`. Extend the matching `@repo/config` tsconfig preset.
2. Add `@module-federation/vite` with a unique `name`, `filename: 'remoteEntry.js'`, `exposes: { './mount': … }`,
   and a fixed port with `server.origin` set to that port.
3. Implement the same `mount(el, { basePath }) => unmount` contract in any framework. To use UI components
   outside React, import `@repo/ui/register`.
4. In the shell:
   - add the remote to `remotes` in `apps/shell/vite.config.ts` (with its own `VITE_*_REMOTE_URL` variable);
   - declare its module in `apps/shell/src/remotes.d.ts`;
   - add a route with a host component (copy `TodoMfeHost`, or make it generic over the loader and base path).
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
| @types/node | 22.20.5 | | | |

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
- **Additions:** a root `pnpm preview` script, `packages/ui/turbo.json`, and a `data:` favicon in each
  `index.html` (avoids a console 404).
- **No shared dependencies between host and remote yet** (`shared: {}`). Module Federation `dts` type
  generation is off; the remote's types are hand-written in the shell.
