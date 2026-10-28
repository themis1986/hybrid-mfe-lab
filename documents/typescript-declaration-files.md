# TypeScript declaration files (`.d.ts`) in this repo

What `.d.ts` files are, why this repo needs them, and which ones are hand-written versus generated. It assumes no prior knowledge of declaration files.

**Contents**
1. [What a `.d.ts` file is](#1-what-a-dts-file-is)
2. [The `.d.ts` files in this repo at a glance](#2-the-dts-files-in-this-repo-at-a-glance)
3. [`remotes.d.ts`: types for code that arrives at runtime](#3-remotesdts-types-for-code-that-arrives-at-runtime)
4. [`env.d.ts`: types for the bundler's environment](#4-envdts-types-for-the-bundlers-environment)
5. [Generated declarations: `@repo/ui`](#5-generated-declarations-repoui)
6. [What you do not need](#6-what-you-do-not-need)
7. [Things worth knowing](#7-things-worth-knowing)
8. [Troubleshooting](#8-troubleshooting)
9. [Checklists](#9-checklists)

For how the pieces connect at runtime, see [how-it-works.md](how-it-works.md). For the federation configuration that makes the remote import necessary, see [module-federation-explained.md](module-federation-explained.md).

---

## 1. What a `.d.ts` file is

JavaScript has no types. TypeScript adds them, and checks them **before** the code runs, in your editor and in `pnpm typecheck`.

The checker needs to know the shape of everything your code uses: what a function takes, what it returns, what a module exports. For your own `.ts` files it reads the code directly. For code that is already compiled to JavaScript, or that does not exist as a file on disk, it needs a separate description.

A **declaration file** (`.d.ts`) is that description:

- It contains **only types**: signatures, no function bodies.
- It produces **no JavaScript**. It is read by the compiler and the editor, and never executed or shipped to the browser.
- It says "this code exists, and this is its shape", not "here is the code".

```ts
// the real code, in a .js or .ts file somewhere:
export function add(a, b) { return a + b }

// its declaration, in a .d.ts file:
export function add(a: number, b: number): number
```

## 2. The `.d.ts` files in this repo at a glance

| File | Written by | Describes | Why it is needed |
|---|---|---|---|
| `apps/shell/src/remotes.d.ts` | Hand | The federated module the shell loads at runtime | The module does not exist on disk, so the compiler cannot find it. |
| `apps/shell/src/env.d.ts`, `apps/todo-mfe/src/env.d.ts` and `packages/ui/src/env.d.ts` | Hand | Vite's browser-side types | `types` is empty in the base config, so Vite's types must be pulled in explicitly. |
| `packages/ui/dist/*.d.ts` | `tsc` (generated) | The built `@repo/ui` package | The apps import the built JavaScript, which carries no types. |

The first two kinds you maintain. The third is rebuilt automatically.

## 3. `remotes.d.ts`: types for code that arrives at runtime

### The problem

The shell contains `import('todo/mount')`. There is no `todo/mount` in the shell's project and no such package in `node_modules`. The module appears only in the browser, after the federation runtime downloads it from the remote's server. Left alone, the compiler reports "Cannot find module 'todo/mount'".

### The solution

`apps/shell/src/remotes.d.ts` declares the module by hand:

```ts
declare module 'todo/mount' {
  export function mount(el: HTMLElement, props: { /* the contract's props */ }): () => void
}
```

This tells the compiler: "a module named `todo/mount` exists and exports a function with this signature." As a result:

- the import compiles without an error;
- calls to `mount` are type-checked and autocompleted;
- the shell's host component can derive its own type from it with `typeof import('todo/mount')`.

### It is a contract written twice

The real function lives in `apps/todo-mfe/src/mount.ts`. `remotes.d.ts` is a **hand-written copy of its signature**. The compiler cannot look inside the remote, so it trusts the copy completely:

```
apps/todo-mfe/src/mount.ts      the real signature
          ▲   keep identical, by hand
apps/shell/src/remotes.d.ts     what the shell's compiler believes
```

If the two drift apart, nothing warns you. `pnpm typecheck` passes, because the shell is checked only against its own copy, and the mismatch surfaces at runtime. Federation can generate these declarations automatically, but that is turned off (`dts: false` in both Vite configs), so keeping the files in sync is part of the job. Importing the MFE's source into the shell to share the type is not an option, because the shell must only know the contract.

### Why the file must stay "global"

`declare module 'todo/mount' { … }` works here because `remotes.d.ts` has **no top-level `import` or `export`**. That makes it a global script, and the declaration creates a brand-new module name.

If you add a top-level `import` or `export` to the file, TypeScript treats it as a module itself. The same `declare module` line then means "augment an existing module", and since `todo/mount` cannot be resolved, the compiler reports an error. If you need to import a type there, use an inline `import('…')` type inside the declaration instead.

### Where it is picked up

The shell's `tsconfig.json` has `"include": ["src"]`, so every `.d.ts` file under `src/` is loaded automatically. No import is needed. A `.d.ts` outside `include` is ignored.

## 4. `env.d.ts`: types for the bundler's environment

Each app, and `packages/ui`, has `src/env.d.ts` with one line:

```ts
/// <reference types="vite/client" />
```

- The `///` line is a **triple-slash directive**: it tells the compiler to load another set of declarations.
- `vite/client` describes what Vite adds to browser code: `import.meta.env`, and imports of assets such as images and stylesheets. In `packages/ui` it is what lets `import './styles/index.css'` (a side-effect import) and `import styles from './styles/index.css?inline'` (typed as `string`) typecheck.

It is needed because `packages/config/base.json` sets `"types": []`. By default TypeScript automatically loads every `@types/*` package it finds, which pulls in globals nobody asked for. An empty list switches that off, so anything an app wants, here Vite's types, must be requested explicitly in a file like this.

## 5. Generated declarations: `@repo/ui`

### Why they exist

The apps consume `@repo/ui` from its built `dist/`, not from its source (see the `exports` map below). Built JavaScript carries no types, so the build also emits a `.d.ts` file for every module. Without them, the apps would see `@repo/ui` as untyped.

### How they are produced

In `packages/ui/package.json`, the build script runs two tools in sequence:

```
"build": "vite build && tsc -p tsconfig.build.json"
```

| Step | Tool | Output |
|---|---|---|
| 1 | `vite build` | `dist/*.js`, the JavaScript |
| 2 | `tsc -p tsconfig.build.json` | `dist/*.d.ts`, the declarations only |

`tsconfig.build.json` extends the normal config and sets `declaration: true` and `emitDeclarationOnly: true`, so `tsc` writes types and no JavaScript. Vite's `emptyOutDir: false` keeps the watcher in `pnpm dev` from deleting those `.d.ts` files when it rewrites the JavaScript.

### How the apps find them

The package's `exports` map points each entry at both files:

```json
"exports": {
  ".":          { "types": "./dist/index.d.ts",    "import": "./dist/index.js" },
  "./register": { "types": "./dist/register.d.ts", "import": "./dist/register.js" },
  "./styles.css": "./dist/styles.css"
}
```

- The compiler follows `types`, and the bundler follows `import`.
- `./styles.css` maps to a plain file with no conditions. It needs no declaration: in the apps, `vite/client` already declares `*.css` imports.
- `types` is listed first on purpose: conditions are matched in order, and the compiler stops at the first one it understands.

### The empty one

`dist/register.d.ts` contains only `export {};`. That is correct: `@repo/ui/register` is imported for its **side effects** (it injects the stylesheet and defines the custom elements) and exports nothing, so there is nothing to describe.

### The leftover stylesheet import

`dist/index.d.ts` starts with `import './styles/index.css';`. TypeScript keeps side-effect imports in declaration files, and `src/index.ts` has this import so that Vite emits `dist/styles.css`. The path doesn't exist inside `dist/`, but that is harmless:
- the apps compile with `skipLibCheck: true`, so declaration files in dependencies aren't checked;
- `vite/client` declares `*.css` imports anyway.

A consumer without both would need its own `*.css` declaration.

### The consequence

If `dist/` has not been built, the apps cannot resolve `@repo/ui` at all, neither the JavaScript nor the types. That is why `typecheck` depends on the ui build in `turbo.json` (`dependsOn: ["^build"]`), and why running `tsc` by hand in an app before building ui fails.

After changing `packages/ui/src`, the apps only see the new types once ui has been rebuilt. `pnpm dev` keeps a watcher running for this.

## 6. What you do not need

- **A `*.vue` shim.** Many Vue projects add a file declaring `*.vue` as a module. Here, `vue-tsc` understands `.vue` files natively, so none exists. This is also why the repo stays on TypeScript 6: `vue-tsc` needs a compiler API that TypeScript 7 removed.
- **A declaration file for the shell's own consumers.** Nothing imports the shell, so it emits none.
- **Generated federation types.** Turned off with `dts: false`, as above.

## 7. Things worth knowing

**Vite does not check types.** `vite dev` and `vite build` strip the types and ignore any errors in them. A wrong or missing `.d.ts` never breaks the build or the running app. It only shows up in your editor and in `pnpm typecheck`. The commands are:

| Package | Typecheck command |
|---|---|
| shell, ui | `tsc` |
| todo-mfe | `vue-tsc` (it also checks `.vue` files) |

Each package runs a second pass over `vite.config.ts` through its `tsconfig.node.json`.

**`skipLibCheck` is on.** `base.json` sets `skipLibCheck: true`, which makes the compiler skip checking the **inside** of every `.d.ts` file, including the ones you write. A typo in a type name inside `remotes.d.ts` may therefore go unreported. The compiler still *uses* the declarations when checking other code; it just does not validate the declaration files themselves.

**Declarations describe, they do not enforce.** Writing `mount` as returning `() => void` in `remotes.d.ts` does not make the remote return one. It only makes the compiler assume it does.

## 8. Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Cannot find module 'todo/mount'" | `remotes.d.ts` is missing, is outside the tsconfig `include`, or the module name in `declare module` does not match the import specifier exactly. |
| That same error appears after you edited `remotes.d.ts` | You added a top-level `import` or `export`, turning the file into a module (see [section 3](#why-the-file-must-stay-global)). |
| "Cannot find module '@repo/ui'" or missing types from it | `packages/ui/dist` has not been built. Run `pnpm build`, or `pnpm typecheck`, which builds ui first. |
| `pnpm typecheck` passes, but the app fails at runtime on a call to the remote | `remotes.d.ts` has drifted from `mount.ts`. |
| `import.meta.env` is flagged as unknown | `env.d.ts` is missing or is outside `include`. |
| A type changed in `packages/ui/src`, but the apps still show the old one | The ui build has not run since. Rebuild it, or start `pnpm dev`. |

## 9. Checklists

**When you change the remote's contract** (the signature of the exposed function, or the exposed key):

1. Edit `apps/todo-mfe/src/mount.ts`.
2. Edit `apps/shell/src/remotes.d.ts` to match, including the module name if you changed the `exposes` key.
3. Update the host component that calls it.
4. Run `pnpm typecheck`, then run the apps. Typecheck cannot catch a mismatch between steps 1 and 2.

**When you add another microfrontend:** add a `declare module '<remote>/<exposed>' { … }` block to `remotes.d.ts` for each module you import from it. The full steps are in "Adding another microfrontend" in the [README](../README.md).

**When you add a new entry point to `@repo/ui`:** add it to the `exports` map with a `types` entry beside `import`, and make sure `tsc` emits its declaration (it does, as long as the file is under `src`).
