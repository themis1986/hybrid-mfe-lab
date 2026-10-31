# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pnpm + Turborepo microfrontends skeleton:
- **`apps/shell`** (`@repo/shell`, React 19 + React Router 8) is the host. At runtime it loads two remotes through Module Federation (`@module-federation/vite`):
  - **`apps/todo-mfe`** (`@repo/todo-mfe`, Vue 3 + Vue Router 5);
  - **`apps/ui-vue-docs`** (`@repo/ui-vue-docs`, Vue 3 + Vue Router 5), the Vue library's documentation.
- Two component libraries with the same `T`-prefixed components and the same look ("Option B": two native libraries sharing the tokens):
  - **`packages/ui`** (`@repo/ui`): React + Radix + Tailwind v4;
  - **`packages/ui-vue`** (`@repo/ui-vue`): Vue 3 + Reka UI + Tailwind v4.
- **`packages/tokens`** (`@repo/tokens`): the design tokens and the token → Tailwind theme, shared by both libraries and by apps that run Tailwind.
- **`packages/config`** (`@repo/config`) holds the shared tsconfig presets.
- **Transition in progress:** the todo MFE still renders `@repo/ui` through the custom-element bridge (`@repo/ui/register`, "Option A"). It will move to `@repo/ui-vue`, and the bridge will be removed. Until then the bridge rules below still apply.

All content is placeholder; the repo exists to prove the wiring.
- README.md: setup, the version table and the rationale for each deviation.
- `documents/how-it-works.md`: the full build-time and runtime walkthrough.
- `documents/module-federation-explained.md`: beginner's guide to the federation config.
- `documents/typescript-declaration-files.md`: what each `.d.ts` file is for and which are hand-written.
- `documents/monorepo-tooling.md`: onboarding guide to pnpm, Turborepo and what `pnpm dev` runs.
- `documents/design-system.md`: tokens, the Tailwind layer, the React and Vue component recipes, naming, adding a component.
- `documents/react-components-in-vue.md`: the Option A/B decision and the custom-element bridge rules (props, booleans, events, styles, costs).

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
pnpm dev         # turbo: ui + ui-vue `vite build --watch`, todo-mfe (:5174), ui-vue-docs (:5175), shell (:5173)
pnpm build       # turbo; builds the libraries first (^build)
pnpm typecheck   # tsc in shell/ui, vue-tsc in ui-vue and the Vue apps; needs the libraries built first (turbo handles it)
pnpm preview     # production builds served by `vite preview` on the same ports
pnpm --filter @repo/todo-mfe dev   # any single package/task
```

**No tests or linter.** To verify, run the apps:
- the shell at http://localhost:5173 (its own routes and each remote's route);
- each remote standalone: http://localhost:5174 and http://localhost:5175.

The ports are `strictPort`: if one is already taken, the server exits instead of moving to another port. Stopping one persistent turbo task stops the whole `pnpm dev`/`pnpm preview` run.

## Architecture: how the pieces connect

**Runtime composition (shell → remotes).**
- Each remote exposes `./mount` (`src/mount.ts`) with the contract
  `mount(el: HTMLElement, props: { basePath: string }) => unmount`.
- `apps/shell/src/RemoteMfeHost.tsx` has `createRemoteHost(load, basePath, appName)`, which builds a remote's host component:
  - it lazy-loads the remote's `mount` with `React.lazy`, inside `<Suspense>` and an `ErrorBoundary`;
  - it calls `mount` in a `useEffect` and returns the unmount function as its cleanup;
  - it stays safe under StrictMode's double effects because unmount fully tears the app down.
- One small file per remote (`TodoMfeHost.tsx`, …) creates its host and exports its base path.
- Each remote has a splat route (`<basePath>/*`). A Vue remote uses `createWebHistory(basePath)`, so its own routes are relative to its base path.
- The shell must never import Vue or remote source; it only knows the contract.
- The contract's types are hand-written in `apps/shell/src/remotes.d.ts` (federation `dts` is off). **Keep that file in sync with each `mount.ts`.**
- A Vue remote's unmount calls `app.unmount()` **and** `history.destroy()`. The second call is required: `app.unmount()` leaves Vue Router's `popstate` listener on `window`.
- Each Vue remote sets its own `app.config.idPrefix`: `useId()` is unique only within one app, and several Vue apps share the page.

**Styles of a federated remote.**
- A remote can't rely on its host, or on federation (`bundleAllCSS` is off), to load a CSS file. Its CSS travels inside its JavaScript.
- A Vue remote on `@repo/ui-vue` has one stylesheet, `src/styles.css`: `@repo/ui-vue/styles.css` plus its own Tailwind (no Preflight, `@repo/tokens/theme.css`). `mount.ts` imports it with `?inline`, injects it as `<style id="<app>-styles">` and removes it on unmount. Don't use SFC `<style>` blocks or CSS file imports in a remote.
- The todo MFE gets the `@repo/ui` stylesheet from `@repo/ui/register` (below).

**React UI inside Vue (custom-element bridge, todo MFE only, being phased out).**
- `@repo/ui` has two JS entries and a stylesheet:
  - `.` exports the React components (`T<Name>`, `T<Name>Props`);
  - `./styles.css` is the stylesheet; React hosts import it once (the shell does, in `main.tsx`);
  - `./register` injects the same stylesheet as one `<style id="t-ui-styles">`, then defines each component as a `t-<name>` custom element with `@r2wc/react-to-web-component`.
- The todo MFE imports `@repo/ui/register` once (in `mount.ts`). Vue's `isCustomElement` treats `t-*` tags as custom elements (`apps/todo-mfe/vite.config.ts`), so `t-` is reserved for design-system elements in its templates.
- `register` carries its CSS inline on purpose (see above). Don't replace it with a CSS file import.
- Props are declared in `r2wc(..., { props })`; undeclared props never reach the component. Booleans must be bound in Vue (`:flag="true"`): a bare attribute is an empty string, which r2wc parses as false.
- `bridge()` in `register.ts` strips the `container` prop r2wc passes to every component; wrap every new component with it.
- Native events (e.g. `click`) just bubble out of the element. Don't map their React handlers (e.g. `onClick`) in r2wc `events`: it would dispatch a second event.
- Disabled states use the native `disabled` attribute, never `pointer-events: none`: the click would land on the `t-*` host, where Vue's listener is.
- Text and content must come through props: in light DOM, React replaces child nodes, so slots don't work. Light DOM (no shadow root) is deliberate: global CSS and Radix portals need it.
- New custom elements go in `register.ts` through `define()`, which keeps the `customElements.get` guard. Layout components are never registered (children can't cross the bridge).

**Tokens (`packages/tokens`).**
- CSS only, no build step: `tokens.css` and `theme.css`, exported as `@repo/tokens/tokens.css` and `@repo/tokens/theme.css`.
- `tokens.css`: primitives `--t-<hue>-<step>` (Radix Colors scales, light on `:root`, dark under `prefers-color-scheme`) and semantic `--t-color-<role>` etc. Components use semantic tokens only, via Tailwind utilities.
- `theme.css`: the `@theme inline` bridge that maps tokens to utilities. `--color-*: initial` removes Tailwind's default palette; only token colours exist.
- Radius, font, shadow and easing reuse Tailwind's standard names so `tailwind-merge` works without config. Keep it that way, or extend tailwind-merge.
- Layout tokens (`--t-container-*`, `--t-layout-*`) are not mapped into `@theme` (Tailwind's `--container-*` also drives `@container`); components use `max-w-(--t-…)`. Spacing and type use Tailwind's scale.
- Consumers list it as a devDependency: it is compiled into their CSS at build time. Because it has no build task, each library's `turbo.json` lists `$TURBO_ROOT$/packages/tokens/**` as a `build` input, so a token change invalidates the cache.

**Component libraries (`packages/ui`, `packages/ui-vue`).**
- Each library's `src/styles/index.css` imports Tailwind's `theme.css` and `utilities.css` **without Preflight** (a library must not reset its host page), `@repo/tokens/tokens.css` into `layer(base)`, and `@repo/tokens/theme.css`. Only classes used inside that library's `src` exist in its stylesheet.
- Variants use `cva`; classes are merged with `cn` (`src/lib/cn.ts`). Without Preflight, base classes must reset UA defaults themselves.
- **The class strings in each `*.variants.ts`, and `src/lib/layout.ts`'s maps, are identical in both libraries.** Change them in both, or the libraries stop looking the same.
- React (`@repo/ui`): a native element plus Radix `Slot` (`asChild`), or a Radix primitive for real behaviour.
- Vue (`@repo/ui-vue`):
  - SFCs with `<script setup>`, rooted on Reka `Primitive` (`as` + `asChild`), or a Reka component for real behaviour;
  - `inheritAttrs: false` plus `useRootAttrs()` (`src/lib/attrs.ts`) merge the caller's class through `cn`, so the caller wins conflicts as in React;
  - prop types are written out in `types.ts`: Vue's `defineProps` can't derive runtime props from cva's `VariantProps`;
  - content goes through slots (named slots where React takes node props), and inputs use `defineModel`;
  - components that render their own structure around the content take `as` but not `asChild`.
- Layout components hold no state (collapsing and the like is a caller-controlled prop) and are intrinsically responsive (flex-wrap, auto-fit, `min(100%, …)`), with no viewport breakpoints except the page-level app frame's one `max-md:`. A root restyles its parts only through direct-child `data-slot` selectors.
- The shell runs its own Tailwind (`apps/shell/src/index.css`): theme + utilities **without Preflight** (remotes render inside its page), plus `@repo/tokens/theme.css`. It loads after `@repo/ui/styles.css`. The todo MFE doesn't run Tailwind: only classes used inside `packages/ui/src` exist there.

**Libraries are consumed from `dist/`, not source.**
- Apps resolve them through the package `exports` (`dist/*.js` + `dist/*.d.ts` + `dist/styles.css`). A change in a library's `src` reaches the apps only after a rebuild; `pnpm dev` keeps a watcher running for each library.
- `build` runs `vite build`, then emits the `.d.ts` files: `tsc -p tsconfig.build.json` in ui, `vue-tsc -p tsconfig.build.json` in ui-vue.
- In ui, `@tailwindcss/vite` compiles `src/styles/index.css` twice: imported by `index.ts` it becomes `dist/styles.css` (`build.lib.cssFileName: 'styles'`); imported with `?inline` by `register.ts` it becomes a string in `register.js`. ui-vue only builds `dist/styles.css`. `dist/index.d.ts` keeps the CSS import line; that's expected and harmless (`skipLibCheck`).
- Each Vite config keeps the framework and every runtime dependency external (ui: `react`, `react-dom`, `@r2wc/*`, `@radix-ui/*`; ui-vue: `vue`, `reka-ui`; both: `class-variance-authority`, `clsx`, `tailwind-merge`). Add any new runtime dependency there too.
- `emptyOutDir: false` plus unhashed chunk names keep the watcher from deleting the `.d.ts` files.
- `sideEffects` lists the bare-import entries (`dist/styles.css`, and ui's `dist/register.js`), so they aren't tree-shaken. Update that list if you add another side-effect entry.
- A running `pnpm dev` doesn't pick up changes to a library's `package.json` `exports` or `vite.config.ts`, or new workspace packages: restart it.

**Federation config.**
- `shared: {}` everywhere, so each remote bundles its own Vue (and the todo MFE its own React). This is a known, accepted duplication; sharing is a planned optimization. If React becomes a shared singleton, the custom element's `root.unmount()` would run during the shell's commit and must be deferred.
- Remotes must use `type: 'module'` in the shell's `remotes`.
- Each remote sets `server.origin` so its dev-server URLs resolve when loaded from the shell.
- The shell reads each remote's URL from a `VITE_*_REMOTE_URL` variable at **build time** (defaults: `http://localhost:5174/remoteEntry.js`, `http://localhost:5175/remoteEntry.js`). Each variable is listed in the root `turbo.json` `build.env`, so it is part of the cache key.

## Toolchain constraints (non-obvious, don't "fix" these)

- **TypeScript is pinned to 6.x on purpose.** TS 7 has no JS compiler API, and `vue-tsc` needs it.
- **Dependency versions live in the pnpm `catalog:`** in `pnpm-workspace.yaml`; packages reference `"catalog:"`. Bump versions there.
- **pnpm 12's defaults:**
  - `minimumReleaseAge` is 24 h, so pnpm won't install versions published less than a day ago;
  - `strictDepBuilds` makes the install fail on any unapproved dependency install script; approve via `allowBuilds` in `pnpm-workspace.yaml`.
- **tsconfig presets must stay self-contained inside `packages/config`.** Use `extends: "./base.json"`. Vite 8's tsconfig resolver follows the pnpm symlink path, so a preset extending `../../something` breaks the build.
- **Each package has two tsconfigs:** `tsconfig.json` for `src` (DOM) and `tsconfig.node.json` for `vite.config.ts`. `typecheck` runs both.
- **`types` defaults to `[]`** in the base config. Browser code gets Vite types through `src/env.d.ts` (`/// <reference types="vite/client" />`).
- **Each library's `turbo.json`** makes its `dev` depend on its own `build`, so the watcher starts after the first build (otherwise both write `dist/` at once).

## Adding another microfrontend

Follow the steps in README.md ("Adding another microfrontend"):
1. A new `apps/<name>` exposing the same `mount` contract, with a unique federation `name` and a fixed port. A Vue remote uses `@repo/ui-vue`, injects its stylesheet inline, and sets `app.config.idPrefix`.
2. In the shell:
   - a `remotes` entry with its own `VITE_*_REMOTE_URL` variable (also added to the root `turbo.json` `build.env`);
   - a declaration in `remotes.d.ts`;
   - a host file built with `createRemoteHost`, and its splat route;
   - an entry in the sidebar menu config (`apps/shell/src/navigation.ts`).
