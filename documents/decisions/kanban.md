# Decision record: Kanban board

Status: accepted, 2026-11-04. Research done on that date against npm, the official documentation and the packages' source.

The repo gained a working Kanban board as a second React remote. This record explains the choices, mainly the drag-and-drop library.
What the app does and how to extend it are in [apps/kanban-mfe/README.md](../../apps/kanban-mfe/README.md).

## Shape

```
apps/kanban-mfe   @repo/kanban-mfe   the remote: a plain store, a pure reducer, components on @repo/ui
  src/dnd/                           the only code that imports @dnd-kit
packages/ui       TDropdownMenu      added for the board's menus (Radix)
packages/ui-vue   TDropdownMenu      its Vue counterpart (Reka), with the same class strings
```

## 1. Drag and drop: `@dnd-kit/react` 0.5

The brief's hard requirements: cards within and across columns at an exact index, column reordering, a preview and a drop indicator,
auto-scroll, an empty-column target, a full keyboard drag with announcements, and touch.

| Criterion                      | `@dnd-kit/react`                         | `@dnd-kit/core` + `sortable`                 | `pragmatic-drag-and-drop`                      | `@hello-pangea/dnd`                  | `react-aria-components`                             |
| ------------------------------ | ---------------------------------------- | -------------------------------------------- | ---------------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| Version, last release          | 0.5.3, 2026-10-31                        | 6.3.1 / 10.0.0, Dec 2024                     | 4.0.0, 2026-09-24                              | 18.0.1, Feb 2025                     | 1.22.1, 2026-10-09                                  |
| Weekly downloads               | 2.6 M                                    | 41 M                                         | 2.5 M                                          | 4.9 M                                | 8.3 M                                               |
| Size (bundlephobia, min+gzip)  | 33 kB                                    | 14 + 4 kB                                    | not measured: the tool sees only an entry stub | 29 kB, with redux                    | 279 kB whole package; tree-shaken cost not measured |
| Keyboard drag                  | Built in, moves between lists            | Built in; across lists needs own coordinates | **None by design:** docs recommend menus       | Built in                             | Built in: Tab between targets                       |
| Screen-reader announcements    | Plugin, fully customisable               | Built in, customisable                       | Build your own                                 | Built in, customisable               | Built in                                            |
| Touch                          | One pointer sensor, long press           | Separate touch sensor                        | Native drag: OS-controlled preview             | Built in                             | Built in                                            |
| Across and within, columns too | Yes, nested sortables                    | Yes, with more wiring                        | Yes, you compute everything                    | Yes                                  | Between lists yes; nested lists not documented      |
| Auto-scroll                    | Plugin, handles nested scrollers         | Built in                                     | Add-on package                                 | Built in, **one scroll parent only** | Limited to the collection                           |
| Preview and animation          | `DragOverlay`, top-layer, drop animation | `DragOverlay`, you animate                   | Browser's native preview                       | Clone, built-in motion               | `renderDragPreview`, native preview                 |
| React 19 peer range            | Yes                                      | `>=16.8`                                     | No React dependency                            | Yes                                  | Yes                                                 |
| Fit beside Radix               | Headless, no conflict                    | Headless, no conflict                        | Headless, no conflict                          | Own render-prop components           | **A second headless system beside Radix**           |

**Why not the others:**

| Alternative                  | Why not                                                                                                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pragmatic-drag-and-drop`    | Native HTML5 drag has no keyboard drag, and its accessibility guide recommends menus instead. Good guidance, and the board has those menus too, but the brief requires a keyboard drag.      |
| `@hello-pangea/dnd`          | The closest out-of-the-box fit, but its docs support only one scroll parent. The board scrolls sideways with columns scrolling inside it. Also no release in 21 months, and it brings redux. |
| `react-aria-components`      | Strong accessibility, but drag is tied to its own collections, so cards would become its grid items beside Radix everywhere else.                                                            |
| `@dnd-kit/core` + `sortable` | **The fallback.** Mature and by far the most used, but no release in 23 months, and development has moved to the new package. Its keyboard needs custom code to cross lists.                 |

**What the choice costs:** it's pre-1.0. The catalog's caret stays on 0.5.x, all use is confined to `src/dnd/`, and a browser spike ran before any UI was built
on it. The spike passed, so the fallback wasn't needed.

Bundled per remote like everything else (`shared: {}`). The remote's whole JavaScript is about 770 kB, 230 kB gzipped, most of it React, Radix and the library code it uses.

## 2. How the library is used

Its documented setup needed changes for this board. Each of these came from reading the 0.5.3 source or from a failing browser check.

- **The optimistic sorting plugin is off** (`plugins: [SortableKeyboardPlugin]`). By default it moves DOM nodes itself, which competes with React for the same nodes and
  can make React throw on the next commit. The board renders a draft through React instead.
- **A draft during the drag, one action at the drop.** Dispatching on every `dragover` would flood history; this gives one entry and one Undo per drag.
- **The draft lives in a ref, mirrored to state.** The library runs handlers in a transition and swaps them at commit, so a handler can be a render behind. The drop reads the
  ref.
- **No `@dnd-kit/helpers`.** Its `move` sends a card below the last one in the upper half of a tall column to index 0. `lib/order.ts` does this in 30 pure lines.
- **A mouse must travel 5 px to start a drag.** By default, a press on a handle starts one at once, so a click would never reach the card's button.
- **Space picks up, Enter opens.** By default both pick up. The sensor's options aren't merged with its defaults, so the config spreads them.
- **Key repeats are filtered.** The sensor ends a drag on any Space keydown, so holding the key would drop right after the pick-up.
- **Up and Down stop at a column's edge.** The library picks the nearest target in the direction pressed, so Down at the bottom would jump to the next column.
- **An empty column gets normal collision priority.** At low priority, keyboard moves skip it for the cards beyond.
- **Focus returns from a layout effect.** A cross-column move remounts the card. The draft renders in a transition, so a `requestAnimationFrame` ran too early.
- **Own announcements.** Positions depend on the draft, and the library's announcement callbacks could run before the handler that updates it. `BoardDnd` has its own live region.
- **Every handler catches errors.** A throw inside the library's transition leaves the drag stuck, waiting on a render that never comes.
- **`dropAnimation` is never `null`.** The library honours reduced motion itself, and `null` also skips its focus restore.

## 3. State: a plain store, no library

`useSyncExternalStore` over a small object, as the shell's `theme.ts` and `auth.ts` do, but created per mount. The scope limits rule out a state library, and nothing here needs one: a
reducer plus a stack of boards gives history, and selectors over immutable data give narrow re-renders.

The reducer holds no React and no ids of its own, so it can be tested directly, replayed for collaboration, or moved to a server.

## 4. Undo: whole boards, and a toast that means the latest change

History stores board snapshots, not inverse actions. Structural sharing keeps them small, and there's no inverse to get wrong for each new action.

A toast's Undo calls the same `store.undo()`, which reverts the latest change. So any new change, undo or redo dismisses the open toast; otherwise its Undo would revert something else. The
shell's alarm host renders the toast and outlives the remote, so unmounting dismisses it too.

## 5. Library additions: only `TDropdownMenu`

The board needs real menus: roles and arrow keys, which `TPopover` doesn't give. It's broadly reusable, so it went into both libraries, with identical class strings. It is non-modal by default, because a modal
menu blocks the page's pointer events and can leave them blocked when an item opens a dialog.

Badge, avatar, skeleton and empty state are a few lines of markup with no behaviour. Adding each to both libraries, with docs entries, would have outgrown the task, so they stay local and are listed as a next step.

No side sheet: the library has none, and a dialog does the job.

## How this was checked

The repo has no test setup, and none was added. A throwaway script drove the installed Chrome (`playwright-core`, kept outside the repo) through about 150 checks, standalone and inside the shell, against both dev and production
builds.

**Checked:** mouse, keyboard and emulated touch drags at exact indexes; cancel; empty columns; column reordering; auto-scroll on both axes; filtered drops; undo and redo; every dialog and menu; light, dark, reduced motion and narrow
viewports; access per account; repeated mount and unmount with stylesheets, body nodes and `window`/`document` listeners tallied; the remote being down.

**Not checked:**

- **A real screen reader.** The checks read the live region's text and the ARIA attributes. What VoiceOver or NVDA actually says is unverified.
- **A real touch device.** Touch was emulated in Chrome. iOS Safari in particular is untested, including a card remounting under the finger mid-drag.
- **Browsers other than Chrome.** The library's click and key handling can differ in Safari and Firefox.

**What stays after unmount:** the library adds one no-op `touchmove` listener to `window`, once per bundle, to allow blocking scroll during a touch drag. It doesn't grow across mounts.

## Trade-offs accepted

- A pre-1.0 library for a hard requirement, behind an adapter.
- State resets on navigation, which follows from "state inside `mount`" plus in-memory only.
- A drag preview for a column shows only its header, since carrying a whole column obscures the drop position.
- A column's count and WIP warning update at the drop, not during the drag, because the store doesn't change until then.
- Dragging while filtered places a card relative to the cards on show; where it lands among hidden ones is decided by its shown neighbour.

## Next steps

Listed and prioritised in [the app's README](../../apps/kanban-mfe/README.md#next-steps). For this record: a real screen-reader and device pass is the priority, and it's worth rechecking the library's defaults at each minor
release, since section 2 depends on its internals.
