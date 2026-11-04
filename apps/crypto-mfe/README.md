# Crypto MFE

A crypto market dashboard, and a remote of the shell. It shows market totals, sentiment and the top 100 coins, with a
detail page for each coin and a watchlist. It is built on `@repo/ui-vue`, fetches through TanStack Query and keeps its
client state in Pinia. The choices behind it are in [documents/decisions/crypto.md](../../documents/decisions/crypto.md).

| How it runs  | URL                                  |
| ------------ | ------------------------------------ |
| In the shell | http://localhost:5173/crypto-app     |
| Standalone   | http://localhost:5179                |
| Remote entry | http://localhost:5179/remoteEntry.js |

## Setup

No setup is needed: it runs on CoinGecko's keyless API.

```sh
pnpm --filter @repo/crypto-mfe dev   # or `pnpm dev` from the root, for everything
```

The keyless API allows only about 5 calls a minute, and browsing a few coins quickly can reach that. For more room, get a
free CoinGecko Demo key and set it:

```sh
cp apps/crypto-mfe/.env.example apps/crypto-mfe/.env.local   # then set VITE_COINGECKO_API_KEY
```

The key ends up in the bundle and CoinGecko can't restrict it by URL, so keep it to local work. Never log, print or commit
it, and check for the file with `test -f`, never `cat`.

## What's done

- **Market overview.** Market cap, 24h volume, BTC dominance and the Fear & Greed Index; market-cap share as ranked bars;
  30 days of Fear & Greed.
- **Top 100 table.** Rank, coin, price, 1h/24h/7d change, volume, market cap and a 7-day sparkline. Sorting, search,
  paging and column pinning. Sort, page and search survive a visit to a coin.
- **Open a coin** by clicking its row, or with Enter on its name in the keyboard grid. The name is a real link, so it can
  also open in a new tab.
- **Coin page.** Price and change, a price chart with four ranges, statistics, a short description and links.
- **Watchlist.** Star a coin to keep it for this visit, in memory only.
- **Loading and failure states.** Skeletons on first load, a notice while a retry waits, an error panel if retries run
  out, and old data kept on screen with a badge if an update fails. One source failing costs only what depends on it.

## Data sources and their terms

| Data                               | Source                                                                | Key      | Terms that shape the code                                                                                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Market list, totals, coins, charts | [CoinGecko](https://docs.coingecko.com/docs/keyless-public-api)       | Optional | Keyless: about 5 calls a minute per IP, meant for testing rather than production. Demo key: 100 a minute, 10,000 a month. Attribution required next to the data, which the page footer gives. |
| Fear & Greed Index                 | [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | None     | The credit must sit right next to the data, so it is on the card and under the chart.                                                                                                         |
| Charts                             | Highcharts, through `@repo/ui-vue/charts`                             | None     | Free for personal and educational use only: see [chart-core's README](../../packages/chart-core/README.md).                                                                                   |

Commercial use would need a paid CoinGecko plan and a Highcharts license.

CoinGecko's `/global` response has a Fear & Greed value of its own, and it differs from Alternative.me's. The app ignores
it, so the number on screen always matches the credit beside it.

## How it's built

```
src/
  mount.ts      the federation contract; creates the router, Pinia and the QueryClient
  types.ts      the app's own types; provider responses never go past src/api/
  api/          keys.ts (query keys), http.ts (ApiError), one file of fetch functions per provider
  stores/       Pinia: the watchlist, the chart range and the table's state
  hooks/        everything components use: queries (through queryOptions), state, what a query's state means
  lib/          pure helpers: formatting, the retry policy, safe text and links
  pages/        one component per route
  components/   they render, and call hooks
```

- **Two kinds of state.** What the APIs return lives in TanStack Query's cache; only client state lives in Pinia.
  Components reach the store through `useCryptoState()`.
- **One Pinia and one `QueryClient` per mount**, never at module scope. Unmounting also calls `queryClient.clear()`,
  which cancels polling and any retry that is still waiting.
- **Query keys come only from `api/keys.ts`,** one hierarchical factory per domain: `coinKeys.detail(id)` also covers that
  coin's charts.
- **Components never call `useQuery` or the API.** Each hook builds its query with `queryOptions()`.
- **The call budget shapes the settings.** Only prices poll, every 2 minutes (1 with a key); totals refresh every 5
  minutes; charts and the daily index don't poll. Refetch on window focus is off, and the cache is kept for 30 minutes so
  going back to a coin or a range costs nothing. The coin page fetches its chart after the coin loads, so calls don't
  arrive in a burst and an unknown id costs one call.
- **A failure may be a rate limit the browser can't see.** CoinGecko's 429 has no CORS header, so `fetch` reports it as a
  network error. `lib/retry.ts` treats both the same, and waits 20 then 60 seconds, as every retry also counts against the
  limit. `useQueryPhase` turns a query's state into what the viewer sees, and `QueryStatus` renders it.
- **Previous data is kept between ranges only.** `useCoinChart` doesn't use a plain `keepPreviousData`, which would show one
  coin's chart under another coin's name.
- **Provider text is never markup.** Descriptions are reduced to plain text and links are limited to `http(s)` in
  `lib/text.ts`. Nothing uses `v-html`.
- **Sparklines are plain SVG,** because a chart engine instance per row would be far too heavy. The chart engine and its
  components are lazy-loaded.
- **The table has no row event.** `useCoinRowClick` is one listener on the table, for the pointer. The keyboard path is the
  name cell's link, marked `data-t-activate` so Enter reaches it through the table's grid.

Limit: the table's search covers every column with a value, including numbers, so typing a digit also matches prices.

Types and theming rules for remotes are in the repo's root `CLAUDE.md` and `documents/`.

## How to extend it

- **Another provider:** add a file in `src/api/` that maps its responses onto `types.ts`, and call it from the hooks.
  Nothing else knows about providers. It throws `ApiError`, which is what the retry policy and the error panels read.
- **Another query:** add its key to `api/keys.ts`, a fetch function to `src/api/`, and a hook with `queryOptions()`. Show
  it through `QueryStatus`. Count its calls against the budget above before giving it a `refetchInterval`.
- **Another table column:** add it to `columns` in `CoinTable.vue`, and a `#cell-<id>` slot if it needs its own rendering.
- **Another route:** add it in `mount.ts`, with a page in `src/pages/`.

## What to plan next

Roughly in the order that would add the most for the least work.

**Features**

- **Shareable URLs:** the chart range and the table's search in the query string. The router is already there.
- **Remember things between visits:** the watchlist and table preferences in `localStorage`, through the table's
  `serializeTableState`.
- **Other currencies:** a `vs_currency` choice in the store and the query keys.
- **Compare coins:** two or more lines on one chart, indexed to a common start.
- **Candlesticks:** needs a new chart type in `chart-core` and both libraries, and the Stock module.
- **Exchanges:** a list and detail page from CoinGecko's exchange endpoints.

**Foundations**

- **A small server proxy,** to hide a key, cache responses across users and turn the shared per-visitor limit into one
  budget. CoinGecko's docs recommend this, and it is the first step before any real deployment.
- **A second provider as a fallback:** Coinpaprika has a keyless list without sparklines, so the table could survive a
  CoinGecko outage in a reduced form.
- **Tests:** unit tests for `src/api/` mapping and `lib/`, then end-to-end tests with the APIs stubbed, including the
  no-CORS 429. The repo has no test setup yet.
- **A per-column search opt-out in `table-core`,** so a digit doesn't match prices.
- **Sharing Vue and the chart engine with the other remotes** through federation, part of the repo's planned optimization.
