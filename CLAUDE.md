# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pnpm + Turborepo microfrontends skeleton:
- **`apps/shell`** (`@repo/shell`, React 19 + React Router 8) loads **`apps/todo-mfe`** (`@repo/todo-mfe`, Vue 3 + Vue Router 5) at runtime through Module Federation (`@module-federation/vite`).
- Both apps render one React `Button` from **`packages/ui`** (`@repo/ui`).
- **`packages/config`** (`@repo/config`) holds the shared tsconfig presets.

All content is placeholder; the repo exists to prove the wiring.
- README.md: setup, the version table and the rationale for each deviation.
- `documents/how-it-works.md`: the full build-time and runtime walkthrough.

Current scope limits:
- one UI component (`Button`) only: no design system, styling layer or Storybook;
- no todo functionality;
- no state management, auth, testing framework, linting, CI or Docker.

Don't add these unless asked.

## Commands

Requirements: Node ≥ 22.22 and pnpm 12. The repo pins `packageManager: pnpm@12.16.0`.

```sh
pnpm install
pnpm dev         # turbo: ui `vite build --watch` + todo-mfe dev (:5174) + shell dev (:5173)
pnpm build       # turbo; builds @repo/ui first (^build)
pnpm typecheck   # tsc in shell/ui, vue-tsc in todo-mfe; needs ui built first (turbo handles it)
pnpm preview     # production builds served by `vite preview` on the same ports
pnpm --filter @repo/todo-mfe dev   # any single package/task
```

**No tests or linter.** To verify, run the apps:
- the shell at http://localhost:5173 (`/` and `/todo-app`);
- the MFE standalone at http://localhost:5174.

The ports are `strictPort`: if one is already taken, the server exits instead of moving to another port. Stopping one persistent turbo task stops the whole `pnpm dev`/`pnpm preview` run.

## Architecture: how the pieces connect

**Runtime composition (shell → MFE).**
- The MFE exposes `./mount` (`apps/todo-mfe/src/mount.ts`) as the remote `todo`, with the contract
  `mount(el: HTMLElement, props: { basePath: string }) => unmount`.
- `apps/shell/src/TodoMfeHost.tsx` does the following:
  - lazy-loads `todo/mount` with `React.lazy`, inside `<Suspense>` and an `ErrorBoundary`;
  - calls `mount` in a `useEffect` and returns the unmount function as its cleanup;
  - stays safe under StrictMode's double effects because unmount fully tears the app down.
- The shell route is `/todo-app/*` (splat). The MFE uses `createWebHistory(basePath)`, so its own routes are relative to `/todo-app`.
- The shell must never import Vue or MFE source; it only knows the contract.
- The contract's types are hand-written in `apps/shell/src/remotes.d.ts` (federation `dts` is off). **Keep that file in sync with `mount.ts`.**
- The MFE's unmount calls `app.unmount()` **and** `history.destroy()`. The second call is required: `app.unmount()` leaves Vue Router's `popstate` listener on `window`.

**React UI inside Vue (custom-element bridge).**
- `@repo/ui` has two entries:
  - `.` exports the React `Button`;
  - `./register` defines `<ui-button>` with `@r2wc/react-to-web-component`.
- The MFE imports `@repo/ui/register` once (in `mount.ts`). Vue's `isCustomElement` treats `ui-*` tags as custom elements (`apps/todo-mfe/vite.config.ts`).
- Props are declared in `r2wc(..., { props })`.
- Clicks rely on the **native** `click` bubbling out of the element. Don't map `onClick` in r2wc `events`: it would dispatch a second `click`.
- Text must come through the `label` prop: in light DOM, React replaces child nodes, so slots don't work.
- New custom elements go in `register.ts` behind the existing `customElements.get` guard.

**`@repo/ui` is consumed from `dist/`, not source.**
- Apps resolve it through the package `exports` (`dist/*.js` + `dist/*.d.ts`). A change in `packages/ui/src` reaches the apps only after a rebuild; `pnpm dev` keeps a watcher running for that.
- `build` runs `vite build && tsc -p tsconfig.build.json`; `tsc` emits the `.d.ts` files.
- The Vite config keeps `react`, `react-dom` and `@r2wc/*` external.
- `emptyOutDir: false` plus unhashed chunk names keep the watcher from deleting the `.d.ts` files.
- `sideEffects` lists `dist/register.js`, so the bare `import '@repo/ui/register'` isn't tree-shaken. Update that list if you add another side-effect entry.

**Federation config.**
- `shared: {}` in both apps, so the MFE bundles its own Vue and React. This is a known, accepted duplication; sharing React is a planned optimization. If React becomes a shared singleton, the custom element's `root.unmount()` would run during the shell's commit and must be deferred.
- The remote must use `type: 'module'` in the shell's `remotes`.
- The MFE sets `server.origin` so its dev-server URLs resolve when loaded from the shell.
- The shell reads the remote URL from `VITE_TODO_REMOTE_URL` at **build time** (default `http://localhost:5174/remoteEntry.js`). The variable is part of the Turbo `build` cache key.

## Toolchain constraints (non-obvious, don't "fix" these)

- **TypeScript is pinned to 6.x on purpose.** TS 7 has no JS compiler API, and `vue-tsc` needs it.
- **Dependency versions live in the pnpm `catalog:`** in `pnpm-workspace.yaml`; packages reference `"catalog:"`. Bump versions there.
- **pnpm 12's defaults:**
  - `minimumReleaseAge` is 24 h, so pnpm won't install versions published less than a day ago;
  - `strictDepBuilds` makes the install fail on any unapproved dependency install script; approve via `allowBuilds` in `pnpm-workspace.yaml`.
- **tsconfig presets must stay self-contained inside `packages/config`.** Use `extends: "./base.json"`. Vite 8's tsconfig resolver follows the pnpm symlink path, so a preset extending `../../something` breaks the build.
- **Each package has two tsconfigs:** `tsconfig.json` for `src` (DOM) and `tsconfig.node.json` for `vite.config.ts`. `typecheck` runs both.
- **`types` defaults to `[]`** in the base config. Browser code gets Vite types through `src/env.d.ts` (`/// <reference types="vite/client" />`).
- **`packages/ui/turbo.json`** makes ui's `dev` depend on its own `build`, so the watcher starts after the first build (otherwise both write `dist/` at once).

## Adding another microfrontend

Follow the steps in README.md ("Adding another microfrontend"):
1. A new `apps/<name>` exposing the same `mount` contract, with a unique federation `name` and a fixed port.
2. In the shell: a `remotes` entry with its own `VITE_*_REMOTE_URL` variable, a declaration in `remotes.d.ts`, and a route with a host component modeled on `TodoMfeHost`.
