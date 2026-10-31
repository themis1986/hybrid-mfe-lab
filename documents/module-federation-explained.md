# Module Federation explained from scratch

A beginner's guide to the federation configuration in this repo: what problem it solves, what each option means, and what happens in the browser. It assumes no prior knowledge of Module Federation.

**Contents**
1. [The problem](#1-the-problem)
2. [The core idea: host, remote and the catalog](#2-the-core-idea-host-remote-and-the-catalog)
3. [The remote's configuration](#3-the-remotes-configuration)
4. [The host's configuration](#4-the-hosts-configuration)
5. [What happens in the browser](#5-what-happens-in-the-browser)
6. [The other options](#6-the-other-options)
7. [The host component that ties it together](#7-the-host-component-that-ties-it-together)
8. [Common mistakes and how they show up](#8-common-mistakes-and-how-they-show-up)
9. [Summary](#9-summary)

For the full build-time and runtime walkthrough of the whole repo, see [how-it-works.md](how-it-works.md). For setup and commands, see the [README](../README.md).

---

## 1. The problem

Normally one app is built into one bundle. Here there are two apps, built and served separately:

- the **shell** (`apps/shell`, React);
- the **todo MFE** (`apps/todo-mfe`, Vue).

The other remotes (the two docs apps, one Vue and one React) are wired exactly the same way; this guide follows the todo MFE.

The shell must show the MFE's UI, but it must not copy the MFE's code in at build time. If it did, every change to the MFE would force a rebuild and redeploy of the shell, and the two apps would no longer be independent.

Module Federation solves this: **at runtime, the browser fetches a piece of code from another app's server and runs it.**

## 2. The core idea: host, remote and the catalog

Think of a mall (the host) and a shop (the remote) in its own building.

| Analogy | Module Federation term | In this repo |
|---|---|---|
| The mall | **Host**: the app that consumes code from elsewhere | `apps/shell` |
| The shop in its own building | **Remote**: the app that offers code to others | `apps/todo-mfe` |
| The shop's catalog: what it sells and where each item is stored | **Remote entry**: a small generated file listing the exposed modules | `remoteEntry.js` |
| The items the shop sells | **Exposed modules** | `./mount` |
| The shop's address, stored in the mall's address book | **Remote entry URL** | `http://localhost:5174/remoteEntry.js` |

The flow in one sentence: the host knows only the **address of the catalog**. When it needs something, it fetches the catalog, finds out where the item lives, fetches that, and uses it.

Both sides use the same plugin, `@module-federation/vite`, configured through the `federation()` function in their `vite.config.ts`. The plugin does the build-time work (producing the catalog, rewriting imports) and ships a small runtime that does the fetching in the browser.

### Source versus generated output

"The catalog" exists in two forms, and it is easy to mix them up:

| | What it is | Where it lives | Who reads it |
|---|---|---|---|
| **`exposes`** in `vite.config.ts` | The **instruction**: what to offer, as a public name plus a source file | Your source code, on your machine | The build tool, at build time. The browser never sees it. |
| **`remoteEntry.js`** | The **generated result**: the same catalog as a file the browser can run | The build output, served by the remote's server | The federation runtime in the browser, at runtime |

Think of `exposes` as the recipe and `remoteEntry.js` as the finished dish. The browser can't read `vite.config.ts`, so the build translates it:

```
YOUR CONFIG (source, build time)           BUILD OUTPUT (what the browser downloads)
────────────────────────────────           ─────────────────────────────────────────
exposes: {                                 remoteEntry.js contains a lookup table:
  './mount': './src/mount.ts'    ──build──▶    "./mount" → load the chunk mount-<hash>.js
}                                          mount-<hash>.js = compiled src/mount.ts + everything it imports
```

Each half of the `exposes` pair changes during the build:

- **The public name** (`'./mount'`) is copied unchanged into `remoteEntry.js` as the lookup key. It is the name the host uses in `import('todo/mount')`.
- **The source path** (`'./src/mount.ts'`) can't be used by a browser. The build compiles that file, and everything it imports, into a chunk with a **hashed** file name, and `remoteEntry.js` records that name.

The hash changes on every build. This is why the catalog exists at all: the host can't hard-code a file name that changes, so it hard-codes only the stable name `remoteEntry.js` and lets the catalog translate "give me `./mount`" into the current chunk's file name.

## 3. The remote's configuration

From `apps/todo-mfe/vite.config.ts`:

```ts
federation({
  name: 'todo',
  filename: 'remoteEntry.js',
  exposes: {
    './mount': './src/mount.ts',
  },
  shared: {},
  dts: false,
})
```

| Option | Meaning |
|---|---|
| `name` | The remote's identity. Hosts use it to refer to this app. |
| `filename` | The name of the generated catalog file. The build writes it, and the server serves it at `/remoteEntry.js`. |
| `exposes` | The public list of what this app offers, as `publicName: realFile` pairs. |
| `shared` | Libraries to share with other apps. Empty means nothing is shared (see [section 6](#6-the-other-options)). |
| `dts` | Whether to generate TypeScript types for consumers. Off here (see [section 6](#6-the-other-options)). |

**`exposes` is the only door, and it is the source of the catalog.** At build time the plugin turns this setting into `remoteEntry.js` (see [source versus generated output](#source-versus-generated-output)). Everything not listed is private:

- `'./mount'` is the name outsiders use. The leading `./` is a convention for "a path inside this remote".
- `'./src/mount.ts'` is the file that backs it.
- Other files in the MFE can still be pulled into the exposed chunk as dependencies of `mount.ts`, but the host can't ask for them directly.

The exposed file is the **contract**. It exports one function, `mount(el, props)`, which renders the whole Vue app into a DOM element and returns a function that tears it down. Because the host can only call that function, the host never needs to know Vue exists.

## 4. The host's configuration

From `apps/shell/vite.config.ts`:

```ts
federation({
  name: 'shell',
  remotes: {
    todo: { type: 'module', name: 'todo', entry: todoRemoteUrl },
  },
  shared: {},
  dts: false,
})
```

| Option | Meaning |
|---|---|
| `name` | The host's own identity. |
| `remotes` | The address book: which remotes this app can load, and where their catalogs are. |
| `remotes.todo` (the key) | The nickname used in code. It is the first half of the import specifier: `import('todo/mount')` means "remote `todo`, exposed module `./mount`". |
| `name: 'todo'` | The remote's own `name`. It must match the `name` in the remote's config. |
| `entry` | The URL of the catalog. It comes from `VITE_TODO_REMOTE_URL`, or defaults to `http://localhost:5174/remoteEntry.js`. |
| `type: 'module'` | How to load the catalog. `'module'` loads it as a standard ES module with `import()`, which is what a Vite-built remote produces. The alternative, `'var'`, is for older webpack-style remotes loaded as classic scripts. |

Two things to notice:

- **Three names must agree:** the remote's `name`, the host's `remotes` key and the host's `name` entry for it. They are all `todo` here. A mismatch means the host looks for a remote that doesn't exist.
- **`entry` is a build-time setting.** The shell reads the environment variable when it is built, and the URL is baked into the output. To point production at a different server, rebuild the shell with `VITE_TODO_REMOTE_URL=<url>`. Turbo includes this variable in the shell's build cache key, so a changed value forces a fresh build.

## 5. What happens in the browser

```
Browser on :5173 (shell)                          Server on :5174 (todo MFE)
────────────────────────                          ──────────────────────────
1. The user opens the MFE's route
2. Shell code runs import('todo/mount')
3. Federation runtime looks up "todo"
   in its address book → entry URL       ──GET──▶  remoteEntry.js   (the catalog)
4. Catalog says: "./mount lives in
   this chunk"                           ──GET──▶  the chunk         (mount.ts + Vue + deps)
5. The import resolves to { mount }
6. The shell calls mount(container, props)
```

### Steps 4 to 6 in detail

**Step 4: the catalog says where `./mount` lives, and the browser fetches it.**

`remoteEntry.js` is a small JavaScript file, not a plain list. In a production build, its core is a lookup table whose values are functions that know how to fetch each exposed module. Simplified (the real file is minified and does extra bookkeeping, such as loading CSS):

```js
{
  "./mount": async () => {
    const m = await import("./assets/mount-<hash>.js")
    return m
  }
}
```

1. The federation runtime has downloaded and run `remoteEntry.js`.
2. It looks up `"./mount"` in the table and calls the function.
3. The function runs `import("./assets/mount-<hash>.js")`, so the browser downloads that chunk. The path is relative to where `remoteEntry.js` came from, so it resolves to the remote's server, not the host's.

The chunk contains `mount.ts` plus everything it imports: Vue, Vue Router, the MFE's own code, and `@repo/ui/register` with the React it needs. This is why the remote is heavy, and it is the duplication that `shared: {}` leaves in place (see [section 6](#6-the-other-options)).

**Step 5: the host receives `{ mount }`.**

1. The browser **executes** the chunk. Any top-level code runs at this moment. One example is `@repo/ui/register`, which injects the design system's stylesheet and defines the `t-*` custom elements. The stylesheet travels inside this JavaScript chunk, so the host doesn't have to load any CSS file for the remote.
2. The catalog function returns the chunk's exports as a plain object.
3. That object is what `await import('todo/mount')` produces in the host, so `const { mount } = …` works like any other import.

After this step the host holds `mount`: an ordinary function in memory whose code arrived over the network a moment ago. **Nothing is on screen yet**, and no Vue app exists yet. It is a tool that is ready to be used.

**Step 6: the host component calls `mount(container, props)`.**

1. React renders an empty `<div>` onto the page. This is the container.
2. Once the div is in the page, the host component's `useEffect` runs and calls `mount(container, props)`.
3. `mount` is the MFE's own code, so everything inside it is Vue: it creates the router and the Vue app, then calls `app.mount(container)`. Vue fills the container with the MFE's UI.
4. `mount` returns a teardown function. React stores it as the effect's cleanup and calls it when the route changes, which removes the Vue app.

The result is a Vue app living inside a div on a React-rendered page. React owns the div, Vue owns what is inside it, and `mount` is the only link between them.

The same steps in the mall analogy:

| Step | Analogy |
|---|---|
| 3 | You find the shop's address and ask for its catalog. |
| 4 | The catalog says "item `./mount` is in the box on this shelf", and the shop hands you the box. |
| 5 | You unpack the box and find a tool: the `mount` function. |
| 6 | You put the tool on a spot in your own mall (the div) and switch it on. The shop's staff (Vue) then run that spot. |

The snippet above comes from a production build. The dev server (`pnpm dev`) serves unbundled modules instead, so the file names differ, but the same lookup happens.

**Two facts make this work:**

1. **The import is rewritten at build time.** `import('todo/mount')` doesn't point at any file in the shell's project, because there isn't one. The plugin replaces it with a call into the federation runtime, which performs steps 3–5. Resolving a remote is therefore always **asynchronous**, and the import must be treated like any other network request.
2. **The browser does all the fetching.** The shell's server never talks to the MFE's server. The user's browser requests files from both origins, so the MFE's server must be reachable from the browser, and in production it must allow the shell's origin through CORS.

The shell is also told about its remotes at startup: the plugin injects a small init script that registers `todo` → entry URL. **Registering downloads nothing.** The catalog is fetched only when something first imports from `todo/…`.

## 6. The other options

### `shared: {}`

"Shared" lets the host and the remote use **one copy** of a library, such as React, instead of each bundling its own. A shared config looks like `shared: { react: { singleton: true } }`, where `singleton` means "only ever one copy on the page".

Every app uses an empty object, so **nothing is shared**:

- **Cost:** each remote's chunk carries its own framework (Vue, React, or both for the todo MFE's bridge), and the shell carries its own React. There is duplicate code in the browser.
- **Benefit:** no version conflicts and no coordination between teams. Each app is fully self-contained.

Sharing React is a planned optimization with a known catch, described in [how-it-works.md section 6](how-it-works.md#6-two-copies-of-react-on-one-page).

### `dts: false`

The plugin can generate TypeScript declarations for exposed modules and download them into hosts. That is turned off here, so the host's compiler knows nothing about `todo/mount` by default. `apps/shell/src/remotes.d.ts` declares it by hand, and it must be kept in sync with `apps/todo-mfe/src/mount.ts`. Nothing checks them against each other.

### `server.origin` (remote, dev only)

In dev, the MFE's code refers to its other files with root-relative URLs such as `/src/foo.js`. When that code is loaded from the shell's page on `:5173`, the browser would look for those files on `:5173` and fail. Setting `server.origin: 'http://localhost:5174'` in the remote's Vite config makes the URLs absolute, so they point back at the MFE's server. In a production build, chunks are resolved relative to the remote entry's URL, so this isn't needed.

### `strictPort: true` (both apps)

The shell's `entry` URL hard-codes port 5174. If the MFE's dev server silently moved to another port because 5174 was busy, the address book would be wrong. With `strictPort`, the server exits with an error instead.

### `filename`

Only the remote sets it. The host only needs to know the final URL, which includes this file name, so the two must stay consistent with the host's `entry`.

## 7. The host component that ties it together

The shell builds one host component per remote with `createRemoteHost(load, basePath, appName)` (`apps/shell/src/RemoteMfeHost.tsx`). Each remote's small host file (for example `TodoMfeHost.tsx`) passes it the federation import, `() => import('todo/mount')`, which is where that import is actually used. In order, the host component does this:

1. **`React.lazy` wraps the import**, so the remote is requested only the first time the route renders, not when the shell starts. `React` caches the result, so later visits reuse it.
2. **`Suspense`** shows a loading fallback while the import is in flight.
3. **An error boundary** wraps both, so a failed import (server down, wrong URL) shows a message instead of breaking the page.
4. **An empty container element** is rendered once the import has resolved. React owns that element but nothing inside it.
5. **`useEffect` calls `mount(container, props)`** after React has put the container in the page, and **returns the unmount function as its cleanup**. React then tears the MFE down automatically when the route changes.

The rule behind steps 4 and 5: the shell hands the remote a DOM node and a function signature, and nothing else. It never imports Vue or any MFE source. To add another MFE, create its host with the same factory (see "Adding another microfrontend" in the [README](../README.md)).

## 8. Common mistakes and how they show up

| Symptom | Likely cause |
|---|---|
| The shell shows its error fallback, and the console has a federation error (`RUNTIME-008`) | The remote's server isn't running, or `entry` points at the wrong URL. |
| The error persists after starting the server | `React.lazy` caches the failure. Reload the page. |
| The dev server exits immediately with a port error | The port is taken. `strictPort` is working as intended; free the port. |
| Changing `VITE_TODO_REMOTE_URL` has no effect | The value is read at **build** time. Rebuild the shell. |
| Dev: the remote's chunk loads but its other files return 404 from the shell's port | `server.origin` is missing or wrong in the remote's Vite config. |
| The remote entry loads, but the console says the module `todo/…` isn't found | The key in `exposes` doesn't match what the host imports (for example `./mount` vs `./Mount`). |
| TypeScript says it cannot find module `todo/mount` | The declaration in `remotes.d.ts` is missing or its module name is wrong. |
| It compiles but fails at runtime with a wrong call | `remotes.d.ts` has drifted from the real `mount` signature. |

## 9. Summary

1. The **remote** generates a catalog (`remoteEntry.js`) listing what it **exposes** (`./mount`).
2. The **host** keeps the catalog's address under a nickname in `remotes`.
3. When the host runs `import('todo/mount')`, the federation runtime fetches the catalog, then the one chunk it points to, in the browser.
4. Nothing is **shared**, so each app brings its own libraries. This is simple but duplicates code.
5. The two apps agree on a single thing: the signature of `mount`. It is typed by hand on the host side, so keep it in sync.
