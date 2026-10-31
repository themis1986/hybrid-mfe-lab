# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pnpm + Turborepo microfrontends skeleton:
- **`apps/shell`** (`@repo/shell`, React 19 + React Router 8) loads **`apps/todo-mfe`** (`@repo/todo-mfe`, Vue 3 + Vue Router 5) at runtime through Module Federation (`@module-federation/vite`).
- Both apps render React components from **`packages/ui`** (`@repo/ui`): a small design system (design tokens + Tailwind v4 + Radix, `T`-prefixed components). The shell uses them as React components; the Vue MFE uses them as `t-*` custom elements ("Option A": one React library, bridged; there is no Vue component library).
- **`packages/config`** (`@repo/config`) holds the shared tsconfig presets.

All content is placeholder; the repo exists to prove the wiring.
- README.md: setup, the version table and the rationale for each deviation.
- `documents/how-it-works.md`: the full build-time and runtime walkthrough.
- `documents/module-federation-explained.md`: beginner's guide to the federation config.
- `documents/typescript-declaration-files.md`: what each `.d.ts` file is for and which are hand-written.
- `documents/monorepo-tooling.md`: onboarding guide to pnpm, Turborepo and what `pnpm dev` runs.
- `documents/design-system.md`: tokens, the Tailwind layer, the component recipe, naming, adding a component.
- `documents/react-components-in-vue.md`: the Option A decision and the custom-element bridge rules (props, booleans, events, styles, costs).

Current scope limits:
- a minimal design system (tokens, Tailwind styles, placeholder components) only: no Storybook, icon set or web fonts;
- no todo functionality;
- no state management, auth, testing framework, linting, CI or Docker.

Don't add these unless asked.

The markdown docs (README.md, `documents/`, this file) describe the wiring and patterns, never the placeholder content. Don't name specific components, pages, props or UI text in them: that content is about to change.

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
- `@repo/ui` has two JS entries and a stylesheet:
  - `.` exports the React components (`T<Name>`, `T<Name>Props`);
  - `./styles.css` is the stylesheet; React hosts import it once (the shell does, in `main.tsx`);
  - `./register` injects the same stylesheet as one `<style id="t-ui-styles">`, then defines each component as a `t-<name>` custom element with `@r2wc/react-to-web-component`.
- The MFE imports `@repo/ui/register` once (in `mount.ts`). Vue's `isCustomElement` treats `t-*` tags as custom elements (`apps/todo-mfe/vite.config.ts`), so `t-` is reserved for design-system elements in Vue templates.
- `register` carries its CSS inline on purpose: a federated remote can't rely on its host or on federation (`bundleAllCSS` is off) to load a CSS file. Don't replace it with a CSS file import.
- Props are declared in `r2wc(..., { props })`; undeclared props never reach the component. Booleans must be bound in Vue (`:flag="true"`): a bare attribute is an empty string, which r2wc parses as false.
- `bridge()` in `register.ts` strips the `container` prop r2wc passes to every component; wrap every new component with it.
- Native events (e.g. `click`) just bubble out of the element. Don't map their React handlers (e.g. `onClick`) in r2wc `events`: it would dispatch a second event.
- Disabled states use the native `disabled` attribute, never `pointer-events: none`: the click would land on the `t-*` host, where Vue's listener is.
- Text and content must come through props: in light DOM, React replaces child nodes, so slots don't work. Light DOM (no shadow root) is deliberate: global CSS and Radix portals need it.
- New custom elements go in `register.ts` through `define()`, which keeps the `customElements.get` guard.

**Design system (`packages/ui`).**
- Tokens live in `src/styles/tokens.css`: primitives `--t-<hue>-<step>` (Radix Colors scales, light on `:root`, dark under `prefers-color-scheme`) and semantic `--t-color-<role>` etc. Components use semantic tokens only, via Tailwind utilities.
- `src/styles/index.css` imports Tailwind's `theme.css` and `utilities.css` **without Preflight** (a library must not reset its host page), imports the tokens into `layer(base)`, and maps tokens to utilities with `@theme inline`. `--color-*: initial` removes Tailwind's default palette; only token colours exist.
- Radius, font, shadow and easing reuse Tailwind's standard names so `tailwind-merge` works without config. Keep it that way, or extend tailwind-merge.
- Components: native element + Radix `Slot` (`asChild`), or a Radix primitive for real behaviour; variants with `cva`; classes merged with `cn` (`src/lib/cn.ts`). Without Preflight, base classes must reset UA defaults themselves.
- Only classes used inside `packages/ui/src` exist; the apps don't run Tailwind.
- Layout components are React-only: never custom elements (children can't cross the bridge). They hold no state (collapsing and the like is a caller-controlled prop) and are intrinsically responsive (flex-wrap, auto-fit, `min(100%, …)`), with no viewport breakpoints except the page-level app frame's one `max-md:`. Shared variants live in `src/lib/layout.ts`; a root restyles its parts only through direct-child `data-slot` selectors.
- Layout tokens (`--t-container-*`, `--t-layout-*`) are not mapped into `@theme` (Tailwind's `--container-*` also drives `@container`); components use `max-w-(--t-…)`. Spacing and type use Tailwind's scale.

**`@repo/ui` is consumed from `dist/`, not source.**
- Apps resolve it through the package `exports` (`dist/*.js` + `dist/*.d.ts` + `dist/styles.css`). A change in `packages/ui/src` reaches the apps only after a rebuild; `pnpm dev` keeps a watcher running for that.
- `build` runs `vite build && tsc -p tsconfig.build.json`; `tsc` emits the `.d.ts` files.
- `@tailwindcss/vite` compiles `src/styles/index.css` twice: imported by `index.ts` it becomes `dist/styles.css` (`build.lib.cssFileName: 'styles'`); imported with `?inline` by `register.ts` it becomes a string in `register.js`. `dist/index.d.ts` keeps the CSS import line; that's expected and harmless (`skipLibCheck`).
- The Vite config keeps `react`, `react-dom`, `@r2wc/*`, `@radix-ui/*`, `class-variance-authority`, `clsx` and `tailwind-merge` external. Add any new runtime dependency of ui there too.
- `emptyOutDir: false` plus unhashed chunk names keep the watcher from deleting the `.d.ts` files.
- `sideEffects` lists `dist/register.js` and `dist/styles.css`, so the bare imports aren't tree-shaken. Update that list if you add another side-effect entry.
- A running `pnpm dev` doesn't pick up changes to ui's `package.json` `exports` or `vite.config.ts`: restart it.

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
