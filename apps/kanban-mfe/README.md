# Kanban MFE

A Kanban board, and a remote of the shell. Plan work in columns, drag cards between them with a mouse, a finger
or the keyboard, and undo anything. It is built on `@repo/ui`, moves cards with `@dnd-kit/react`, and keeps its
state in a small store of its own, in memory.

| How it runs  | URL                                  |
| ------------ | ------------------------------------ |
| In the shell | http://localhost:5173/kanban-app     |
| Standalone   | http://localhost:5178                |
| Remote entry | http://localhost:5178/remoteEntry.js |

## Setup

```sh
pnpm --filter @repo/kanban-mfe dev   # standalone; or `pnpm dev` from the root, for everything
```

It needs no environment variables or API keys. Inside the shell, an account needs access to it: `admin` and `react`
have it through their grants, `kanban` has it by name, and `vue` and `todo` see the "no access" page. The named
account is in `apps/shell/.env.example`; add it to your own `.env.local` if you want it.

**The board resets when you leave the page.** State is created inside `mount` and lives in memory, so navigating away
and back, or reloading, starts again from the sample board. Persistence is the first item under
[next steps](#next-steps).

## What's implemented

- **Board.** Columns with cards, seeded with a sample product roadmap. Dates are relative to today, so some cards are
  always overdue. A summary shows the card count, how much is done and what's overdue. The last column counts as done:
  its cards are never overdue.
- **Columns.** Add, rename, delete and reorder. Deleting asks first and offers to move the cards to another column or
  delete them too. An optional WIP limit shows a warning when exceeded; it never blocks a move.
- **Cards.** Add by title from the column (Enter adds and stays open), or with the full form. Open one to edit its title,
  description, column, priority, assignee, due date, labels and checklist. Duplicate and delete from the card's menu or
  the form.
- **Drag and drop.** Cards within and across columns, and columns themselves. A preview follows the pointer, a dashed slot
  shows where the card will land, the board and columns scroll at their edges, and an empty column takes a drop. Cards
  land at the exact index, also while filters hide some of the cards around them.
- **Moving without dragging.** The card menu moves a card to another column; the column menu moves a column left or right.
- **Search and filters.** Search by text, and filter by label, assignee and priority. Chips show what's active, with a count
  and a clear action. Hidden cards are counted in each column.
- **Undo.** Moves and destructive actions show a toast with Undo. Undo and redo buttons go further back, up to 100 steps.
- **States.** A skeleton while loading, a message and retry if loading fails, and messages for an empty column, an empty board
  and no results.
- **Keyboard shortcuts.** `/` search, `N` new card, `⌘/Ctrl+Z` undo, `⇧⌘/Ctrl+Z` redo, `?` the list. They stay out of the way
  while typing, in a dialog or menu, or during a drag.
- **Light, dark, narrow screens.** Colours come from the design tokens only, so the shell's theme switch just works. On a phone
  the board scrolls sideways and snaps to columns.

### Accessibility

- **Keyboard drag:** Tab to a card (one tab stop per card, plus its menu), Space picks it up, the arrow keys move it, Space drops
  it, Escape cancels. Up and Down stay within a column; Left and Right cross columns. Enter opens the card. Columns work the
  same from their grip. Focus stays on the card through a move, including when it changes column.
- **Screen readers:** each move is announced with the card's title and its position ("position 3 of 5 in Review"). A card's button
  carries its priority, labels, assignee, due date and checklist as one name, and the visual copy is hidden from assistive
  technology so it isn't read twice.
- **Structure:** columns are labelled sections holding labelled lists; menus use real menu roles and arrow keys; the delete
  confirmation is an `alertdialog`.
- **Motion:** with `prefers-reduced-motion`, card transitions, the preview's tilt and the library's drop and keyboard animations are off.

Tested by driving Chrome, including touch emulation and reading the announcement text. **Not tested** with a real screen reader
or on a real phone: see the [decision record](../../documents/decisions/kanban.md#how-this-was-checked).

## How it's built

```
src/
  mount.tsx     the federation contract; creates the store and the root, injects the stylesheet
  types.ts      the data model
  data/         the repository interface, its in-memory version, the sample board
  state/        typed actions, the reducer, undo history, the store, its React binding
  lib/          pure helpers: board reads, drop positions, filters, dates, descriptive text
  dnd/          the only code that imports @dnd-kit
  hooks/        everything components use: reads, actions, filters, dialogs, shortcuts, the undo toast
  components/   they render, and call hooks: board/, card/, toolbar/, feedback/, common/
  pages/        the page and its loading and failure states
```

### Data model

Normalised, so looking something up never means walking the board. Order lives only in `board.columnIds` and each
`column.cardIds`.

```ts
Board  { id, title, columnIds, columns: Record<id, Column>, cards: Record<id, Card>, labels, members }
Column { id, title, cardIds, wipLimit: number | null }
Card   { id, title, description, priority, labelIds, assigneeId, dueDate: ISO string | null, checklist, createdAt }
```

### State flow

```
component → hook (useBoardActions) → store.dispatch(action) → boardReducer → history → repository.save
                                                                                 └──→ useSyncExternalStore re-renders what changed
```

- **Every change is one typed action through one pure reducer** (`state/reducer.ts`). Ids and timestamps are made before dispatch, so
  replaying an action gives the same board. An action that changes nothing returns the same object and adds no history entry.
- **History is a stack of whole boards** (`state/history.ts`). Boards are immutable and share every unchanged part, so an entry costs
  about as much as the path the action changed.
- **The store is a plain object with no React in it** (`state/store.ts`), created once per mount: the federated module stays cached after
  unmount, so a module-level store would carry the board into the next mount. Unmounting disposes it.
- **Components read narrowly.** `useCard(id)` and friends select one part of the board, so a card re-renders only when that card changes.
- **Filters and open dialogs are local view state,** not part of the board, so undo never touches them.

### Drag and drop

The choice of library and its alternatives are in the [decision record](../../documents/decisions/kanban.md).

- **Everything touching the library is in `src/dnd/`,** so a swap stays local.
- **During a drag the board shows a draft of the order**, held in `BoardDnd`. The store doesn't change until the drop, which turns the
  draft into a single `card/move` or `column/move`. So a drag is one history entry and one Undo however many columns it crossed, and
  cancelling just drops the draft.
- **The draft lists only the cards on show.** `resolveDropIndex` (`lib/order.ts`) turns that into the real index using the card's neighbours,
  so a drop lands right before the card shown after it, even with filtered cards in between.
- **A card's whole surface is one button**, stretched behind its content: drag anywhere, click to open, one tab stop. The content above it
  takes no pointer events, except the menu button.

## How to extend

**Add a card field,** for example an estimate:

1. Add it to `Card` in `types.ts`, and to `CardPatch` if the form edits it.
2. Set its default in `createCard` (`hooks/useBoardActions.ts`), and in the sample board if you want it shown there.
3. Add it to `CardFormValues` and `submit()` in `hooks/useCardForm.ts`, and a control in `components/card/CardDialog.tsx`, where `CardDialog` builds
   the form's initial values.
4. Show it in `components/card/CardFace.tsx` and add it to `describeCard` (`lib/describe.ts`), so a screen reader hears it too.

The reducer and history need no change: `card/update` merges any patch.

**Add an action,** for example archiving a column's cards:

1. Add it to `BoardAction` in `state/actions.ts`. TypeScript then requires a case in `boardReducer`.
2. Handle it in `state/reducer.ts`, returning the same `board` when nothing changes.
3. Expose it in `hooks/useBoardActions.ts`, making any ids or timestamps there.
4. If it's destructive, add its text to `describeUndoable` (`lib/describe.ts`) and it gets an Undo toast. Undo and redo themselves need nothing.

**Swap the repository:**

1. Implement `BoardRepository` (`data/repository.ts`): `load(signal)` and `save(board)`.
2. Pass it to `createBoardStore` in `mount.tsx`. Nothing else changes: the store already shows the skeleton while loading, and a failed load shows a
   retry.

A real backend would then want the `save` failure surfaced to the user: today the store only logs it, because the in-memory version can't fail.

## Next steps

Roughly in the order that would add the most for the least work.

**Foundations**

- **Persistence.** `localStorage` first, as a second `BoardRepository`, so the board survives leaving the page. Then a backend.
- **Tests.** The reducer, history and `lib/` are pure, so unit tests are cheap; add end-to-end tests of the drag matrix after that. The repo has no test
  setup yet.
- **A real screen-reader and device pass.** VoiceOver, NVDA, and iOS and Android touch. This is the main gap in what's been checked.
- **Unsaved-changes guard.** Closing the card form discards its edits without asking.
- **Promote the local pieces to the libraries.** Badge, avatar, skeleton and empty state are written locally here and duplicated elsewhere (the weather remote has its own
  skeleton, the shell its own tag).
- **Sharing React with the other remotes** through federation, part of the repo's planned optimisation.

**Features**

- **Multiple boards,** with a router using `basePath`, which also gives deep links to a card. `Board` is already self-contained.
- **Label and member management.** Both are seed data today, with no way to add or edit them.
- **Card comments, attachments and an activity log.** `TUpload` exists for attachments; every action already passes through one place for a log.
- **Bulk actions and multi-select.**
- **Swimlanes,** grouped by assignee or priority.
- **Board templates, and import and export** as JSON or CSV.
- **WIP policies:** blocking a move, or requiring a reason, rather than only warning.
- **A shortcut palette,** with shortcuts on the focused card (assign, set priority, move).
- **Due-date reminders and notifications,** through the alarm service.
- **Real-time collaboration.** The action log is a good base, since actions are plain data; it would need conflict handling and server-issued ids.
- **Virtualised columns,** for boards with hundreds of cards per column. Not needed at today's sizes.
- **Analytics:** cycle time and cumulative flow, using the chart components.
- **Date locale.** Dates are formatted as `en-US`, like the rest of the design system's defaults.

Types and theming rules for remotes are in the repo's root `CLAUDE.md` and `documents/`.
