# Microfrontends monorepo skeleton

A React shell that loads Vue microfrontends at runtime with Module Federation, on one token-based design
system (Tailwind v4) delivered as two native component libraries: React (Radix) and Vue (Reka UI), sharing
the tokens. Placeholder content, apart from one small in-memory app; this skeleton just proves the pieces
fit together.

Documentation:

- [documents/monorepo-tooling.md](documents/monorepo-tooling.md): new to the repo? pnpm, Turborepo and what
  `pnpm dev` actually runs.
- [documents/how-it-works.md](documents/how-it-works.md): step by step, how everything connects at build time
  and at runtime.
- [documents/module-federation-explained.md](documents/module-federation-explained.md): a beginner's guide to
  the federation configuration. Start here if Module Federation is new to you.
- [documents/typescript-declaration-files.md](documents/typescript-declaration-files.md): what the `.d.ts`
  files are for.
- [documents/design-system.md](documents/design-system.md): the design system (tokens, Tailwind, the React and
  Vue component recipes).
- [documents/react-components-in-vue.md](documents/react-components-in-vue.md): the custom-element bridge that
  first brought the design system to Vue, and the reasoning behind moving to two libraries.
- [documents/authentication.md](documents/authentication.md): how the shell signs users in and decides which
  remotes each may open.
- [apps/weather-mfe/README.md](apps/weather-mfe/README.md): the weather remote: what it does, its data sources
  and their terms, and what to plan next.
- [apps/kanban-mfe/README.md](apps/kanban-mfe/README.md): the kanban remote: what it does, how it's built, how to
  extend it and what to plan next. The choices behind it, mainly drag and drop, are in
  [documents/decisions/kanban.md](documents/decisions/kanban.md).
- [apps/crypto-mfe/README.md](apps/crypto-mfe/README.md): the crypto remote: what it does, its data sources and their
  terms, how it's built, how to extend it and what to plan next. The choices behind it are in
  [documents/decisions/crypto.md](documents/decisions/crypto.md).
- [packages/map-core/README.md](packages/map-core/README.md): the map components (Mapbox GL JS) in both
  libraries: token setup, usage, markers vs layers. The choices behind them are in
  [documents/decisions/map.md](documents/decisions/map.md).
- [packages/chart-core/README.md](packages/chart-core/README.md): the chart components (Highcharts) in both
  libraries: usage, theming with the tokens, modules, and the license (free for personal and educational use
  only). The choices behind them are in [documents/decisions/charts.md](documents/decisions/charts.md).
- [packages/table-core/README.md](packages/table-core/README.md): the data table (TanStack Table and Virtual) in both
  libraries: usage, state, server mode and limits. The choices behind it are in
  [documents/decisions/table.md](documents/decisions/table.md).

## Architecture

```
                      browser: http://localhost:5173
┌──────────────────────────────────────────────────────────────────────┐
│ apps/shell  (@repo/shell)            React 19 + React Router 8       │
│   login, frame, menu, home page: React components from @repo/ui      │
│   /<base>/*   a host per remote (createRemoteHost), behind an access │
│               guard: only users granted the remote can open it       │
│                 └─ import('<remote>/mount') ──────────┐ runtime,     │
│                    mount(div, { basePath })           │ federation   │
└───────────────────────────────────────────────────────┼──────────────┘
                                                        ▼
  each remote serves its own remoteEntry.js and exposes "./mount":
┌─────────────────────────────────────────────────────────────────────┐
│ :5174  apps/todo-mfe        Vue 3   @repo/ui-vue, stylesheet inline │
│                                     + Pinia, one store per mount    │
│ :5175  apps/ui-vue-docs     Vue 3   @repo/ui-vue, stylesheet inline │
│ :5176  apps/ui-react-docs   React   @repo/ui, stylesheet inline     │
│ :5177  apps/weather-mfe     Vue 3   @repo/ui-vue, stylesheet inline │
│                                     + Pinia, TanStack Query         │
│ :5178  apps/kanban-mfe      React   @repo/ui, stylesheet inline     │
│                                     + one store per mount           │
│ :5179  apps/crypto-mfe      Vue 3   @repo/ui-vue, stylesheet inline │
│                                     + Pinia, TanStack Query         │
└─────────────────────────────────────────────────────────────────────┘

packages/tokens  (@repo/tokens)  design tokens + the token → Tailwind theme (CSS only)
packages/ui      (@repo/ui)      T-prefixed React components (Radix + Tailwind), styles.css, and a
                                  "register" entry that defines them as t-* custom elements (unused)
packages/ui-vue  (@repo/ui-vue)  the same components natively in Vue (Reka UI + Tailwind), styles.css
packages/map-core (@repo/map-core) framework-agnostic map logic (Mapbox GL JS) behind both libraries'
                                  "./map" entries
packages/chart-core (@repo/chart-core) framework-agnostic chart logic (Highcharts) behind both
                                  libraries' "./charts" entries
packages/table-core (@repo/table-core) framework-agnostic data table logic (TanStack Table) behind both
                                  libraries' "./table" entries
packages/config  (@repo/config)  shared tsconfig presets (base, dom, react, vue, node)
```

- The shell imports no remote code, Vue or React. It only knows the `mount` contract (typed in `apps/shell/src/remotes/remotes.d.ts`).
- The shell owns sign-in and decides which remotes each user may open. The remotes know nothing about it.
- A remote imports nothing from the shell or from another remote. No app imports another's source.
- Each remote is independently buildable and servable, and also runs standalone.

## Running it

Requirements: Node ≥ 22.22 and pnpm 12 (`npm install -g pnpm@12.16.0`; Node 25+ no longer ships corepack).

```sh
pnpm install
cp apps/shell/.env.example apps/shell/.env.local   # the shell's mock sign-in accounts
pnpm dev         # ui + ui-vue (vite build --watch) + the remotes' and the shell's dev servers
```

| What                           | URL                                  |
| ------------------------------ | ------------------------------------ |
| Shell (open this)              | http://localhost:5173                |
| Todo MFE standalone            | http://localhost:5174                |
| Todo MFE remote entry          | http://localhost:5174/remoteEntry.js |
| Vue UI docs MFE standalone     | http://localhost:5175                |
| Vue UI docs MFE remote entry   | http://localhost:5175/remoteEntry.js |
| React UI docs MFE standalone   | http://localhost:5176                |
| React UI docs MFE remote entry | http://localhost:5176/remoteEntry.js |
| Weather MFE standalone         | http://localhost:5177                |
| Weather MFE remote entry       | http://localhost:5177/remoteEntry.js |
| Kanban MFE standalone          | http://localhost:5178                |
| Kanban MFE remote entry        | http://localhost:5178/remoteEntry.js |
| Crypto MFE standalone          | http://localhost:5179                |
| Crypto MFE remote entry        | http://localhost:5179/remoteEntry.js |

Ports are fixed (`strictPort`), so a port that's already in use fails loudly instead of moving.

The shell opens on a login page. The mock accounts, and the apps each one may open, are a JSON array in
`VITE_MOCK_ACCOUNTS`, set in `apps/shell/.env.local` (git-ignored). `apps/shell/.env.example` documents the
format and holds a starting set. Vite inlines the value into the shell's bundle, so it keeps the accounts
out of git, not out of the browser: use dev-only passwords. Without it, sign-in fails with a message saying
what is missing.

The map needs a public Mapbox token, per remote: copy `apps/ui-react-docs/.env.example`,
`apps/ui-vue-docs/.env.example` and `apps/weather-mfe/.env.example` to `.env.local` and set
`VITE_MAPBOX_TOKEN`. Without it, each shows a message instead of a map. See [packages/map-core/README.md](packages/map-core/README.md#token-license-and-cost)
for the license and billing terms.

The crypto remote runs on a keyless API with a tight rate limit. A free key gives it more room: copy
`apps/crypto-mfe/.env.example` to `.env.local` and set `VITE_COINGECKO_API_KEY`. See
[apps/crypto-mfe/README.md](apps/crypto-mfe/README.md#setup).

Other root scripts:

```sh
pnpm build       # build every package (the libraries first, via turbo ^build)
pnpm typecheck   # tsc / vue-tsc in every package
pnpm preview     # production builds served by `vite preview` on the same ports
```

Single packages: `pnpm --filter @repo/todo-mfe dev`, `pnpm --filter @repo/ui build`, and so on.

Module Federation's dev mode works with Vite 8: the remote is served straight by its Vite dev
server, so no `build --watch` + `preview` workaround is needed. `pnpm preview` is the production-like check.

### Opening it from another device

`pnpm dev` and `pnpm preview` listen on every network interface, so a device on the same network opens the shell
or a standalone remote at the machine's address: `http://<machine-ip>:5173`. Vite prints it on its `Network:` line.
If the device can't connect, check that the machine's firewall allows incoming connections for Node.

- **The servers have no authentication.** Anyone on the network can reach them, and read what Vite inlines into the
  bundles: the mock accounts, the Mapbox token and the CoinGecko key. Stop them on a network you don't trust.
- **Plain HTTP on an IP address is not a secure context.** Browser APIs limited to secure contexts are missing or
  refused there, such as `crypto.randomUUID()`, the clipboard API and geolocation. App code must not depend on one
  without a fallback; for ids, use `crypto.getRandomValues()`. They work as usual on `localhost`.
- **A Mapbox token restricted by URL** must also allow the machine's address, or the maps won't load on the device.
- **After the machine's address changes,** restart the servers: a remote's `server.origin` is read once at startup.
- **Vite DevTools** only accepts connections from the machine itself. The apps don't depend on it.

### Remote URLs

The shell reads one variable per remote when it **builds**: `VITE_TODO_REMOTE_URL` (default
`http://localhost:5174/remoteEntry.js`), `VITE_UI_VUE_DOCS_REMOTE_URL` (default
`http://localhost:5175/remoteEntry.js`), `VITE_UI_REACT_DOCS_REMOTE_URL` (default
`http://localhost:5176/remoteEntry.js`), `VITE_WEATHER_REMOTE_URL` (default
`http://localhost:5177/remoteEntry.js`), `VITE_KANBAN_REMOTE_URL` (default
`http://localhost:5178/remoteEntry.js`) and `VITE_CRYPTO_REMOTE_URL` (default
`http://localhost:5179/remoteEntry.js`). Set them in the environment or in `apps/shell/.env.local`:

```sh
VITE_TODO_REMOTE_URL=https://cdn.example.com/todo/remoteEntry.js pnpm build
```

Turborepo includes these variables (root `turbo.json`, `build.env`) in the shell build's cache key.

At runtime, an entry on `localhost` uses the host the page was opened through (`apps/shell/src/remotes/sameHostRemotes.ts`),
so the same server or build works from `localhost` and from another device. An entry on any other host stays as set.

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
- In the shell, `createRemoteHost(load, basePath, appName)` (`apps/shell/src/remotes/RemoteMfeHost.tsx`) builds each
  remote's host component, which lazy-loads the module with `React.lazy`.
  - `<Suspense>` shows a loading state, and an error boundary shows a fallback if the remote can't be loaded.
  - A `useEffect` calls `mount` on a container ref and returns the unmount function as its cleanup.
  - React StrictMode's dev-only mount → unmount → mount is therefore harmless.
- Each remote's route is a splat (`<base>/*`), so the remote can own deeper URLs without the shell knowing
  about them.

### Login and app access

- The shell's session store (`apps/shell/src/lib/auth.ts`) keeps the signed-in user's id in `sessionStorage`:
  a reload keeps the session, closing the tab ends it. The accounts are mock ones (`VITE_MOCK_ACCOUNTS`,
  read by `src/lib/users.ts`); a real identity provider would replace them behind the same async `signIn`.
- Each user holds grants: every app, every app of one framework, or named apps. They combine, and one
  function (`canAccess`, `src/lib/access.ts`) applies them for the menu, the home page and the routes.
- Every route except `/login` sits behind `RequireAuth`, and each remote's route behind `RequireApp`, which
  shows a "no access" page instead of the remote's host. A forbidden remote is therefore never mounted and
  its app code never downloaded.
- This is client-side gating, not security: a remote's files stay reachable from its server. Real
  enforcement needs the server (remote assets behind auth, or a per-user list of remotes).

See [how-it-works.md section 4.5](documents/how-it-works.md#45-login-and-app-access) for the runtime flow.

### Two libraries on shared tokens

| Import                                     | For                                     | What it is                                                                                |
| ------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `@repo/tokens/tokens.css`                  | the libraries' stylesheets              | the design tokens (CSS custom properties)                                                 |
| `@repo/tokens/theme.css`                   | any Tailwind build on the design system | the token → utility theme (`@theme inline`)                                               |
| `@repo/ui` + `@repo/ui/styles.css`         | React apps                              | the `T`-prefixed React components and their stylesheet (tokens + utilities, no Preflight) |
| `@repo/ui-vue` + `@repo/ui-vue/styles.css` | Vue apps                                | the same components natively in Vue, and their stylesheet                                 |
| `@repo/ui/icons`, `@repo/ui-vue/icons`     | React / Vue apps                        | the icon set (Lucide), re-exported, so apps never depend on the icon package themselves   |

- The shell imports `@repo/ui/styles.css` once, in `main.tsx`, followed by its own Tailwind stylesheet
  (`src/index.css`: theme and utilities, no Preflight, plus `@repo/tokens/theme.css`).
- A Vue remote on `@repo/ui-vue` bundles `@repo/ui-vue/styles.css` and its own Tailwind utilities into one
  stylesheet, imports it with `?inline`, and injects it as a `<style>` while it is mounted. A federated remote
  can't count on its host or on the federation runtime to load a CSS file for it.
- Both libraries use identical class strings for their variants, so they look the same; a change goes in both.
- **Light and dark.** The page follows the OS until the shell sets `data-theme="light|dark"` on `<html>`. The tokens
  hold both values (`light-dark()`), so the whole page switches, remotes included. The shell stores the choice and
  applies it before the first paint.

### React UI inside Vue: the custom-element bridge (unused)

`@repo/ui` still builds a third entry point that brought the React library to Vue before `@repo/ui-vue`
existed. No app uses it now; these are its rules, should a Vue host need it again:

| Import              | For           | What it is                                                                                                                                  |
| ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/ui/register` | any framework | injects the `@repo/ui` stylesheet as one `<style>` and defines each component as a `t-*` custom element with `@r2wc/react-to-web-component` |

A host imports `@repo/ui/register` once, in `mount.ts`, and then uses the `t-*` tags in its Vue templates
like native elements. A component `T<Name>` becomes the tag `<t-<name>>`.

- **Vue compiler:** `isCustomElement: (tag) => tag.startsWith('t-')` in the host's `vite.config.ts`
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
- **Bundling:** `@repo/ui` keeps React and its other runtime dependencies external, so a Vue host needs
  `react`/`react-dom` as dependencies and **bundles its own copy of React** into the remote's chunk.

The full rules and trade-offs are in [documents/react-components-in-vue.md](documents/react-components-in-vue.md).
To add a component, follow the checklist in [documents/design-system.md](documents/design-system.md#8-adding-a-component).

### Build details

- `@repo/ui` is built with Vite library mode (ESM, entries `index`, `icons`, `map`, `charts`, `table` and
  `register`), and `tsc` emits its `.d.ts` files. `@repo/ui-vue` is built the same way (entries `index`, `icons`,
  `map`, `charts` and `table`), with `vue-tsc` emitting the `.d.ts` files. The `icons` entries are bare re-exports
  of the external Lucide packages, so apps' builds keep only the icons they import. The `map`, `charts` and `table`
  entries keep those engines out of apps that show none of them.
- `@repo/map-core` is built the same way (one entry, `tsc` for the `.d.ts`). The map engine stays external,
  except its CSS, which is inlined as a string and injected at runtime.
- `@repo/chart-core` is built the same way. Every `highcharts` import stays external (the engine's modules must
  share the app's one copy); its theme is a small token stylesheet injected at runtime.
  Apps consume `dist/` through the package `exports`.
- `@repo/table-core` is built the same way. The engine stays external, so an app holds one copy, resolved with its
  framework adapter's.
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
   and a fixed port. Use `networkServer(port)` from `@repo/config/vite-server.mjs` for `server` and `preview`, and
   `networkOrigin(port)` for `server.origin`.
3. Implement the same `mount(el, { basePath }) => unmount` contract. A Vue remote uses `@repo/ui-vue`,
   puts its styles in one `src/styles.css` injected inline from `mount.ts` (and removed on unmount), and sets
   `app.config.idPrefix`. A React remote does the same with `@repo/ui`: one inline stylesheet, and
   `createRoot(el, { identifierPrefix })` so its `useId()` values stay unique on the page; its unmount calls
   `root.unmount()`. App state is created inside `mount` (a Vue remote: `app.use(createPinia())`), never at
   module scope: the federated module stays cached, so module-level state would outlive the unmount.
4. In the shell:
   - add the remote to `remotes` in `apps/shell/vite.config.ts` with its own `VITE_*_REMOTE_URL` variable, and
     list that variable in the root `turbo.json` `build.env`;
   - declare its module in `apps/shell/src/remotes/remotes.d.ts`;
   - add a host file built with `createRemoteHost`, and its splat route in `App.tsx`, wrapped in
     `<RequireApp id="…">` so only users with access can open it;
   - add its entry to the sidebar menu config (`apps/shell/src/lib/navigation.ts`), with a new `AppId` and an icon;
   - grant it to the accounts that should see it (`VITE_MOCK_ACCOUNTS` in `apps/shell/.env.local`, and the
     starting set in `apps/shell/.env.example`). A user with an `all` grant, or a `tech` grant for its
     framework, sees it without changes.
5. Turborepo picks up the new app's `dev`, `build`, `typecheck` and `preview` tasks automatically.

## Versions

Checked on npm on 2026-10-28, and the two `@dnd-kit` rows on 2026-11-04. Ranges live in the pnpm `catalog:` in `pnpm-workspace.yaml`; installed versions:

| Package                 | Version |     | Package                         | Version   |
| ----------------------- | ------- | --- | ------------------------------- | --------- |
| pnpm                    | 12.16.0 |     | vue                             | 3.5.44    |
| turbo                   | 2.11.10 |     | vue-router                      | 5.4.0     |
| vite                    | 8.3.5   |     | vue-tsc                         | 3.3.13    |
| typescript              | 6.0.3   |     | @vitejs/plugin-vue              | 6.0.10    |
| react / react-dom       | 19.3.1  |     | @vitejs/plugin-react            | 6.1.2     |
| react-router            | 8.5.0   |     | @module-federation/vite         | 1.23.6    |
| @types/react(-dom)      | 19.3.0  |     | @r2wc/react-to-web-component    | 2.1.1     |
| @types/node             | 22.20.5 |     | tailwindcss / @tailwindcss/vite | 4.3.3     |
| @radix-ui/react-dialog  | 1.3.1   |     | @radix-ui/react-label           | 2.1.17    |
| @radix-ui/react-slot    | 1.5.0   |     | class-variance-authority        | 0.7.1     |
| @radix-ui/react-switch  | 1.4.1   |     | reka-ui                         | 2.11.0    |
| clsx                    | 2.1.1   |     | tailwind-merge                  | 3.7.0     |
| lucide-react            | 1.65.0  |     | @lucide/vue                     | 1.65.0    |
| @internationalized/date | 3.12.4  |     | pinia                           | 4.1.0     |
| mapbox-gl               | 3.34.1  |     | @types/geojson                  | 7946.0.16 |
| highcharts              | 13.1.1  |     | @tanstack/vue-query             | 5.105.2   |
| @dnd-kit/react          | 0.5.3   |     | @dnd-kit/dom, @dnd-kit/abstract | 0.5.3     |
| @tanstack/react-table   | 9.3.1   |     | @tanstack/vue-table             | 9.3.1     |
| @tanstack/table-core    | 9.3.1   |     |                                 |           |
| @tanstack/react-virtual | 3.14.26 |     | @tanstack/vue-virtual           | 3.13.52   |

### Deviations from the original brief, and why

- **TypeScript 6.0.3, not 7.0.2 (`latest`).** TypeScript 7 (the native compiler) no longer exposes the JS
  compiler API, which `vue-tsc` still needs to typecheck `.vue` files. One TS version for the whole repo is
  simpler than mixing 7 with a TS 6 alias for the Vue app. Revisit once Vue's language tools support TS 7.
- **No root `tsconfig.base.json`.** The shared base is `packages/config/base.json`. Vite 8's built-in tsconfig
  resolver follows `extends` through the pnpm symlink (`node_modules/@repo/config/…`), so a preset reaching
  back to `../../tsconfig.base.json` fails to resolve. `@repo/config` therefore has to be self-contained.
- **pnpm's release-age gate.** pnpm 12 by default refuses versions published less than 24 h ago
  (`minimumReleaseAge`). That's why the repo uses pnpm 12.16.0 and react-router 8.5.0 rather than the
  day-old 12.16.1 and 8.5.1. Likewise mapbox-gl 3.34.1 (added 2026-11-03), not that day's 3.34.2.
- **Highcharts' license.** Highcharts (the brief's chart engine) is free only for personal and educational use;
  the repo uses it under those terms. Any company use needs a paid Highcharts license: see
  [packages/chart-core/README.md](packages/chart-core/README.md#license).
- **Additions:** a root `pnpm preview` script, a `turbo.json` in each library, and a `data:` favicon in each
  `index.html` (avoids a console 404).
- **No shared dependencies between host and remote yet** (`shared: {}`). Module Federation `dts` type
  generation is off; the remote's types are hand-written in the shell.
