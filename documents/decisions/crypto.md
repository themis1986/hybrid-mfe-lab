# Decision record: crypto market remote

Status: accepted, 2026-11-04. Research done on that date by calling each API with an `Origin: http://localhost:5179`
header, and against the providers' documentation.

The shell gained a sixth remote, a market dashboard. This record explains the choices. What it does and how it's built
are in [apps/crypto-mfe/README.md](../../apps/crypto-mfe/README.md).

## 1. Data providers: CoinGecko and Alternative.me

| Candidate                           | Key      | Limits                                                                        | CORS                   | List and sparklines                                                     | History                                | Verdict                       |
| ----------------------------------- | -------- | ----------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------- | -------------------------------------- | ----------------------------- |
| CoinGecko, keyless                  | None     | About 5 calls a minute per IP, dynamic. The docs say testing, not production. | `*`, but none on a 429 | One call gives 100 coins, three changes, logos and 168-point sparklines | 1, 7, 30 and 365 days all answered     | **Chosen**                    |
| CoinGecko, Demo key                 | Free     | 100 a minute, 10,000 a month                                                  | Same                   | Same                                                                    | One year                               | **Optional**                  |
| Alternative.me                      | None     | None stated                                                                   | `*`                    | Fear & Greed only                                                       | `limit=30` or more                     | **Chosen** for the index      |
| Coinpaprika                         | None     | Sources conflict: 20,000 a month, or 1,000 a day                              | `*`                    | No sparklines; a per-coin history call would make 100 calls per view    | Daily, last year only (older is a 402) | Not used; a possible fallback |
| CoinCap                             | Required | `api.coincap.io` no longer answers; `rest.coincap.io/v3` returns 401          | `*`                    | Not tried                                                               | Not tried                              | Rejected                      |
| Binance (`data-api.binance.vision`) | None     | Weight based, generous                                                        | `*`                    | No market cap, rank or logos; only listed pairs (`USDTUSDT` is a 400)   | Klines                                 | Rejected                      |

CoinGecko despite its tight limit, because it is the only keyless source where one call fills the whole table. Everything
else would take many more calls, or a second id mapping per provider. Coin ids differ between providers, so mixing them
per column isn't cheap.

**A key stays optional.** The app runs with no sign-up. A key would be inlined into the bundle like a Mapbox token, but
unlike one it can't be restricted by URL, so it is for local work. CoinGecko's docs recommend a backend proxy, which this
repo doesn't have. The `x-cg-demo-api-key` header passes CORS preflight, so the key goes in a header rather than the URL.

## 2. Findings that shaped the code

- **A 429 is unreadable in a browser.** CoinGecko's 429 carries `retry-after` but no `Access-Control-Allow-Origin`, so
  `fetch` rejects with a plain `TypeError`. Neither the status nor the header is visible. So a network failure is treated as
  a possible rate limit: same long retry delays, and an error message naming both causes.
- **Retries spend the budget.** The docs count every request against the limit, failed ones included. Rate-limit retries
  wait 20 then 60 seconds, instead of the usual short exponential backoff.
- **The limit is easy to reach.** About ten quick calls were enough to get a 429 during this research. Spaced 25 seconds
  apart, every call succeeded. Hence the budget in the README, and fixtures rather than live calls for repeated testing.
- **Two Fear & Greed indexes disagree.** CoinGecko's `/global` returned 46 (neutral) when Alternative.me's index was 34
  (fear). Only Alternative.me's is shown, with its name beside it.
- **Attribution is required by both, next to the data.** CoinGecko: "Data provided by CoinGecko", linked, above or below
  the data. Alternative.me: right next to the display of the data.
- **Descriptions are HTML from a third party.** They are reduced to text through an inert `DOMParser` document. Links are
  limited to `http(s)`.

## 3. No map

The brief asked for a map only if a free, keyless source with real coordinates fits. None does:

- **Bitcoin nodes (Bitnodes):** `bitnodes.io` now redirects to `btcnodes.io`, a restoration that sends no CORS header, so a
  browser can't read it. The first node sampled was a Tor address with null location fields, and the operator warns the
  count isn't a census of Bitcoin nodes.
- **Exchange headquarters (CoinGecko):** the exchange data has a `country` string, not coordinates. Plotting it would need
  a geocoder or a country-centroid table, and the result would say little about crypto.

So the remote has no `VITE_MAPBOX_TOKEN` and doesn't bundle the map engine.

## 4. Charts

| Data             | Form                                           | Why                                                                                                                                                                                                                              |
| ---------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Price            | Area, on a time axis that fits the data        | One series over time. In the accent colour, as the direction is already in the header, and green or red would flip with the range.                                                                                               |
| Market-cap share | Ranked horizontal bars, top seven plus "Other" | Chosen over a donut with the repo's owner: past the first two coins the shares sit around 1 to 3%, where slices are hard to compare and bars on one baseline aren't. It also comes from `/global`, so it costs no extra call.    |
| Fear & Greed     | A stat card with a meter, and a 30-day line    | The history is what adds information. A gauge would need `highcharts-more` and a validator change in `chart-core`, for what the number and meter already say.                                                                    |
| 7-day trend      | Plain inline SVG in the table                  | No library sparkline exists, and an engine instance per row is far too heavy. The row's cells carry the exact figures.                                                                                                           |
| Candlesticks     | None                                           | The license isn't the obstacle, as the personal terms cover them. `chart-core`'s validator rejects the type, so they'd need a change there and in both libraries, plus the Stock module. The free 7-day data is only 42 candles. |

## 5. TanStack Query

- **Key factories** in one file, hierarchical, and no inline keys.
- **`queryOptions()` in hooks,** so a key and its fetcher can't drift apart, and the same options could serve a prefetch.
  The getter overload keeps options reactive to a route parameter.
- **`shallow: true`** on the coin list and the charts: large, replaced whole, and read by a table that takes raw data anyway.
- **`keepPreviousData` only between ranges.** The plain helper would show one coin's chart under another's name. The
  placeholder function compares the coin id in the previous key.
- **A paused query is a state of its own.** Offline, a query with no data stays pending and paused. `useQueryPhase` reports
  this explicitly, or the page would show a skeleton with no explanation.

## 6. Using the design system without changing it

No library component was added.

- **Row click:** `TDataTable` has no row event. Listeners that aren't props land on its `<table>`, so one delegated listener
  reads `closest('tbody [data-row-key]')`, ignoring interactive elements and a text selection in progress. Keyboard users
  get the name cell's `RouterLink`, marked `data-t-activate`, which the table's grid already clicks on Enter. A real link
  also gives "open in new tab".
- **Skeletons, not the libraries' loading spinners:** the table gets `loading` (skeleton rows), but not `refetching`, which
  renders a spinner; an "Updated" time takes its place. Charts show `TSkeleton` rather than the engine's loading label.
- **Table state in the store** through `v-model:state`, so sort, page and search survive leaving for a coin. The bridge
  reports the whole state, so every slice becomes controlled after the first change, which is harmless here.

## Trade-offs accepted

- **Keyless browsing can hit the limit,** as each newly opened coin costs two calls. The app then explains itself and
  recovers. A real deployment needs the proxy.
- **The table's search also matches numbers.** `table-core` has no per-column opt-out, and it wasn't worth a library change.
- **Near-zero changes show no arrow.** What rounds to 0.00% is treated as flat, so an arrow never sits beside a zero.
- **Only the top 100 coins can appear in the watchlist's table,** which filters the market list to spend no calls. A starred
  coin outside it shows as a link.
