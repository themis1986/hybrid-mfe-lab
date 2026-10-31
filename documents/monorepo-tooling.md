# Monorepo tooling: pnpm, Turborepo and how `pnpm dev` works

An onboarding guide for engineers new to this repo. It explains what happens between typing `pnpm run dev` and seeing the apps start, and where each piece of that is configured.

**Contents**
1. [The big picture](#1-the-big-picture)
2. [What happens when you run `pnpm run dev`](#2-what-happens-when-you-run-pnpm-run-dev)
3. [Where everything is configured](#3-where-everything-is-configured)
4. [pnpm: workspaces, links and the catalog](#4-pnpm-workspaces-links-and-the-catalog)
5. [Turborepo: tasks and their order](#5-turborepo-tasks-and-their-order)
6. [Why `packages/ui` has its own `turbo.json`](#6-why-packagesui-has-its-own-turbojson)
7. [Caching](#7-caching)
8. [Running things without Turbo](#8-running-things-without-turbo)
9. [Common problems](#9-common-problems)
10. [Recipes](#10-recipes)

For what the apps do at runtime, see [how-it-works.md](how-it-works.md). For setup and the version table, see the [README](../README.md).

---

## 1. The big picture

This repo is a **monorepo**: several packages in one git repository that depend on each other.

| Package | Role |
|---|---|
| `apps/shell` | The host app. |
| `apps/todo-mfe`, `apps/ui-vue-docs` | Remote apps that the shell loads at runtime. |
| `packages/tokens` | Design tokens shared by both component libraries (CSS only, no build). |
| `packages/ui` | React components (the shell, and the todo MFE through custom elements). |
| `packages/ui-vue` | The same components natively in Vue (the Vue docs remote). |
| `packages/config` | Shared TypeScript presets. |

Three tools cooperate to make that work, and each has a separate job:

| Tool | Job |
|---|---|
| **pnpm** | Installs dependencies and links the workspace packages to each other. |
| **Turborepo** (`turbo`) | Runs scripts across packages in the right order, and caches results. |
| **Vite** (inside each package) | Does the actual building and serving. |

Keeping them apart is the key to reading any command in this repo: Turbo decides *what runs when*, and the scripts inside each package decide *what actually happens*.

## 2. What happens when you run `pnpm run dev`

From the repo root:

```
you type: pnpm run dev
   │
   ▼
1. pnpm reads ./package.json → scripts.dev = "turbo run dev"
   │
   ▼
2. pnpm runs that string in a shell, with node_modules/.bin on the PATH
   │
   ▼
3. the shell finds `turbo` at node_modules/.bin/turbo
   │
   ▼
4. turbo reads turbo.json and pnpm-workspace.yaml, builds the task graph, runs it
   │
   ▼
5. turbo runs each package's own `dev` script (through pnpm), in the right order
```

**Step 1.** The root `package.json` has:

```json
"scripts": { "dev": "turbo run dev" }
```

This is the only link between `pnpm run dev` and Turbo. pnpm does not know Turbo exists: it runs the string as a shell command.

**Steps 2 and 3.** There is no global `turbo` on your machine. The root `package.json` lists `turbo` under `devDependencies`, so `pnpm install` placed the program at `node_modules/.bin/turbo`. When pnpm runs a script, it puts `node_modules/.bin` at the front of the `PATH`, so the shell finds it.

**Step 4.** Turbo has no hard-coded list of packages or tasks. It gets them from two places:

- `pnpm-workspace.yaml` says which folders are packages (`apps/*` and `packages/*`). Turbo opens each package's `package.json`, records its `scripts`, and reads its `workspace:*` dependencies, which gives it the dependency graph.
- `turbo.json` defines the tasks and how they relate (see [section 5](#5-turborepo-tasks-and-their-order)).

**Step 5.** For `dev`, Turbo finds every package with a `dev` script and starts them:

| Package | Its `dev` script | Result |
|---|---|---|
| `@repo/ui`, `@repo/ui-vue` | `vite build --watch` | Rebuilds the library's `dist/` whenever its source changes. |
| `@repo/todo-mfe` | `vite` | Dev server on `:5174`. |
| `@repo/ui-vue-docs` | `vite` | Dev server on `:5175`. |
| `@repo/shell` | `vite` | Dev server on `:5173`. |

The output you see is prefixed with `package:task` (for example `@repo/ui:build:`), which is Turbo labelling interleaved logs from several processes.

## 3. Where everything is configured

| File | Controls |
|---|---|
| `package.json` (root) | The root scripts (`dev`, `build`, `typecheck`, `preview`), each of which is `turbo run <task>`. Also pins `packageManager` (the pnpm version) and `engines` (the Node version). |
| `pnpm-workspace.yaml` | Which folders are packages, and the `catalog:` of dependency versions. |
| `turbo.json` (root) | The tasks: what each depends on, whether it is cached, whether it is long-running. |
| `packages/ui/turbo.json` | One override of the root rules, for that package only (see [section 6](#6-why-packagesui-has-its-own-turbojson)). |
| `<package>/package.json` | The real commands for that package (`vite`, `vite build`, `tsc`, …) and its dependencies. |
| `.turbo/` | Turbo's local cache and logs. Generated, and git-ignored. |

There are only two `turbo.json` files in the repo: the root one and the one in `packages/ui`. The apps have none because the root rules are enough for them.

## 4. pnpm: workspaces, links and the catalog

**Workspace.** `pnpm-workspace.yaml` lists `apps/*` and `packages/*`. Every folder matching those patterns is a package.

**Workspace links.** An app depends on ui with:

```json
"@repo/ui": "workspace:*"
```

pnpm does not download this from a registry. It symlinks `apps/<app>/node_modules/@repo/ui` to `packages/ui`. That link is also what makes Turbo treat ui as a dependency of the apps, which is why ui builds first. See [How `workspace:*` works](#how-workspace-works) at the end of this section.

**The catalog.** Third-party versions are written once, in the `catalog:` block of `pnpm-workspace.yaml`, and each package writes `"catalog:"` as the version. To bump React, Vite or TypeScript, edit the catalog and nothing else.

**Install policies.** pnpm 12 refuses versions published less than 24 hours ago (`minimumReleaseAge`) and fails on unapproved dependency install scripts (`strictDepBuilds`). If an install fails for one of those reasons, that is why.

### How `workspace:*` works

`"@repo/ui": "workspace:*"` means: "use the copy of `@repo/ui` that lives in this repo, whatever its version is." It never fetches anything from the npm registry.

**The problem it solves.** A normal dependency such as `"react": "catalog:"` means "download a matching version from the registry". `@repo/ui` is not on the registry. It is a folder in this repo, and edits to it should reach the apps directly. The `workspace:` prefix tells pnpm to look inside the repo.

**What it looks like on disk.** After `pnpm install`, each app has a symlink to the real folder:

```
apps/shell/node_modules/@repo/ui     ->  ../../../../packages/ui
apps/todo-mfe/node_modules/@repo/ui  ->  ../../../../packages/ui
```

The lockfile records the same thing for each app: `specifier: workspace:*` and `version: link:../../packages/ui`. When an app imports `@repo/ui`, Node and Vite look in `node_modules/@repo/ui` and are sent to `packages/ui`. There is a single copy of the package, shared by both apps.

A link makes the folder visible, but not every file in it is importable. The package's `exports` map decides which files an app can reach, and here it points into `dist/`. That is why the apps see ui's **built** output, not its source (see [how-it-works.md](how-it-works.md#3-the-ui-package-and-its-two-entry-points)).

**The two parts of the specifier.**

| Part | Meaning |
|---|---|
| `workspace:` | Resolve from the monorepo, never from the registry. If no workspace package has that name, `pnpm install` fails instead of quietly downloading a package of the same name. |
| `*` | Accept any version. A local package has only one version, so there is nothing to choose. |

`workspace:^` and `workspace:~` also exist, and they behave the same as `*` locally. They differ only when a package is packed or published: pnpm replaces `workspace:*` with the package's exact version, and `workspace:^` with `^<version>`. Every package here is `"private": true` and is never published, so the difference does not come up. `*` is the simplest choice.

**What else depends on it.**

- **Turbo's dependency graph.** Turbo learns that ui is a dependency of both apps from these declarations. That is what makes `dependsOn: ["^build"]` build ui first.
- **No version bumping.** You don't release ui and update version numbers in the apps. Editing `packages/ui` and rebuilding it is enough.
- **Each package declares its own.** An app lists `@repo/ui` in its own `package.json`, and `pnpm install` creates one link per package that declares it.

**`workspace:` versus `catalog:`.** Both appear in the same files, but they do different jobs:

| Specifier | Resolves to |
|---|---|
| `"@repo/ui": "workspace:*"` | The local folder `packages/ui`, as a symlink. |
| `"react": "catalog:"` | A registry version, taken from the single list in `pnpm-workspace.yaml`. |

pnpm also allows a catalog entry to point at a workspace package, but this repo does not do that.

## 5. Turborepo: tasks and their order

The root `turbo.json` defines four tasks:

| Task | `dependsOn` | Cached? | Long-running? | Consequence |
|---|---|---|---|---|
| `build` | `^build` | Yes (outputs `dist/**`) | No | The libraries build before the apps that use them. |
| `typecheck` | `^build` | Yes | No | Apps typecheck against the libraries' built `.d.ts` files, so those are built first. |
| `dev` | `^build` | No | Yes | The libraries are built once, then all the dev processes run together. |
| `preview` | `build` | No | Yes | Builds everything, then serves the production output. |

### Reading `dependsOn`

- **`"^build"`** (with a caret) means "run `build` in the packages **I depend on** first". For an app, that is its component library.
- **`"build"`** (no caret) means "run `build` in **this same package** first".

Turbo only needs to be told about these relationships. It already knows the dependency graph from the workspace links.

### What `dev` looks like when it starts

```
@repo/ui#build ──────► @repo/ui#dev            (vite build --watch)
                  ├──► @repo/todo-mfe#dev      (vite on :5174)
                  └──► @repo/shell#dev         (vite on :5173)
@repo/ui-vue#build ──► @repo/ui-vue#dev        (vite build --watch)
                  └──► @repo/ui-vue-docs#dev   (vite on :5175)
```

`@repo/tokens` has no tasks: the libraries compile its CSS into their own stylesheets. Each library's `turbo.json` lists `$TURBO_ROOT$/packages/tokens/**` as a `build` input, so a token change still invalidates their cached builds.

- **`persistent: true`** marks a task as a server that never exits. Turbo keeps it alive and shows its output together with the others. It also means stopping one persistent task stops the whole `pnpm dev` run.
- **`cache: false`** stops Turbo from replaying an old result for a dev server, which would be meaningless.

## 6. Why `packages/ui` has its own `turbo.json`

A package can override the root task rules for itself. `packages/ui/turbo.json` does this for exactly one rule:

```json
{
  "extends": ["//"],
  "tasks": {
    "dev": {
      "dependsOn": ["build"]
    }
  }
}
```

- `"extends": ["//"]` means "start from the root `turbo.json`" (`//` is Turbo's name for the workspace root).
- It then changes one thing: in ui, `dev` must wait for ui's **own** `build`.

**Why it is needed.** ui's `dev` is `vite build --watch`, and its `build` is `vite build && tsc -p tsconfig.build.json`. The second command writes the `.d.ts` files into `dist/`. If both started at once, the watcher and the initial build would write `dist/` simultaneously, and the declaration files could be lost or clash. Making `dev` depend on `build` means the full build, declarations included, runs once, and then the watcher starts.

**Why the root rule cannot cover it.** The root `dev` rule is `^build`, which only covers *other* packages, and ui has none to wait for. Writing `build` (without the caret) in the root would make every app build itself before its own dev server, which is pointless. So the exception sits with the one package that needs it.

**The general rule:** put a setting in the root `turbo.json` when it applies to every package. Add a `turbo.json` inside a package only when that package needs a different rule.

## 7. Caching

Turbo caches the results of cacheable tasks and replays them when nothing relevant has changed.

- **What is cached.** `build` (and `typecheck`). The output files for `build` are `dist/**`. If the inputs are unchanged, Turbo restores `dist/` from the cache instead of rebuilding.
- **What counts as an input.** Every file in the package plus `.env*` files (`inputs: ["$TURBO_DEFAULT$", ".env*"]`), and the dependencies' results.
- **The remote URL variable.** `env: ["VITE_TODO_REMOTE_URL"]` adds that environment variable to the cache key. The shell reads it at **build** time and bakes it into the output. Without this entry, building twice with different URLs would wrongly replay the first result.
- **What is never cached.** `dev` and `preview`.
- **Where the cache lives.** `.turbo/` in the repo root, which is git-ignored.

When a task replays from cache, Turbo prints `cache hit` and the original log. To force a rebuild, add `--force`: `pnpm build --force`.

## 8. Running things without Turbo

Every package script can be run directly:

```sh
pnpm --filter @repo/todo-mfe dev        # one package, one script
```

This skips Turbo, so **nothing builds `@repo/ui` first**. Because the apps use ui's built `dist/` (not its source), they fail to start if `packages/ui/dist` does not exist yet. Build ui first, or let Turbo do it:

```sh
pnpm --filter @repo/ui build
pnpm --filter @repo/todo-mfe dev
```

Turbo can also narrow a run while keeping the ordering:

```sh
pnpm exec turbo run dev --filter=@repo/shell
```

This starts the shell and its dependencies' builds, but not the todo MFE. The shell will load that remote at runtime, so the route that needs it will show its error fallback unless the MFE is running.

## 9. Common problems

| Symptom | Cause and fix |
|---|---|
| The dev server exits with a port error | `5173`, `5174` or `5175` is already in use. The ports are `strictPort`, so the server exits instead of moving. Free the port. |
| Stopping one process stopped everything | Expected: all `dev` tasks are persistent children of one Turbo run. |
| An app cannot resolve `@repo/ui` | `packages/ui/dist` is missing. Run through `pnpm dev`, `build` or `typecheck`, which build ui first. |
| An app shows old ui code or old ui types | ui has not been rebuilt since the change. `pnpm dev` keeps a watcher running for this. |
| A dev server says a `@repo/ui` subpath "is not exported" | ui's `exports` changed while `pnpm dev` was running. Vite keeps the `package.json` it read at startup, and the ui watcher keeps its original `vite.config.ts`. Restart `pnpm dev` after changing either. |
| The shell still points at an old remote URL | `VITE_TODO_REMOTE_URL` is read at build time. Rebuild the shell with the new value. |
| `pnpm install` rejects a version | It was published less than 24 hours ago (`minimumReleaseAge`). |
| `pnpm install` fails on a dependency's install script | `strictDepBuilds`: the script is not approved. |
| `pnpm install` fails on a `workspace:*` dependency | No package in the workspace has that name. Check the spelling against the target's `name` field, and that its folder matches a pattern in `pnpm-workspace.yaml`. |
| An import of a workspace package fails to resolve although the link exists | The package's `exports` points at files that do not exist yet, usually an unbuilt `dist/`. |
| `turbo: command not found` | Dependencies are not installed. Run `pnpm install` at the root, and run scripts through `pnpm`. |

## 10. Recipes

**Add a new package.** Create the folder under `apps/` or `packages/`. Add a `package.json` with the scripts you want. If it needs ui, add `"@repo/ui": "workspace:*"`. Run `pnpm install` to link it. Turbo picks it up automatically: any task it has a script for is now part of that task's run.

**Add a new task.** Add the script to the packages that should run it, then add the task to the root `turbo.json` with its `dependsOn`, and expose it as a root script (`"<task>": "turbo run <task>"`).

**Make one package depend on another.** In the consumer's `package.json`, add `"@repo/<name>": "workspace:*"` under `dependencies` (or `devDependencies`), then run `pnpm install` to create the link. If the target is consumed from a build folder, make sure it builds before the consumer, which Turbo does through `^build` as long as the dependency is declared.

**Change a dependency version.** Edit the `catalog:` block in `pnpm-workspace.yaml`, then run `pnpm install`.

**Override a task for one package.** Add a `turbo.json` in that package with `"extends": ["//"]` and only the tasks you want to change, as in [section 6](#6-why-packagesui-has-its-own-turbojson).
