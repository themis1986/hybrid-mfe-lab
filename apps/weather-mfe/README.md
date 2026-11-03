# Weather MFE

A small weather app, and a remote of the shell. Click anywhere on the map, or search for a city, to see the
current weather and the forecast for that place. It is built on `@repo/ui-vue`, fetches through TanStack Query
and keeps its client state in Pinia.

| How it runs  | URL                                  |
| ------------ | ------------------------------------ |
| In the shell | http://localhost:5173/weather-app    |
| Standalone   | http://localhost:5177                |
| Remote entry | http://localhost:5177/remoteEntry.js |

## Setup

```sh
cp apps/weather-mfe/.env.example apps/weather-mfe/.env.local   # then set VITE_MAPBOX_TOKEN
pnpm --filter @repo/weather-mfe dev                            # or `pnpm dev` from the root, for everything
```

The token is optional. Without one, a message replaces the map, and search and "use my location" still work. It
is a public `pk.` token and ends up in the bundle, so restrict it by URL. A restricted token must allow this
app's origin, or the map won't load and clicked points fall back to their coordinates.

## What's done

- **Pick a place on the map.** A click moves the marker and loads that point's weather. The map follows the page's
  light or dark theme.
- **Current weather card.** Place name, temperature, condition, feels-like, the day's high and low, and a background
  that follows the condition and the time of day at that place.
- **City search.** Debounced, works with the keyboard, and flies the map to the result.
- **Use my location.** The browser only asks for permission when the button is clicked.
- **Metric tiles.** Wind with direction and gusts, humidity, UV, air quality (European AQI), pressure, sunrise and
  sunset.
- **Next 24 hours chart.** Tabs for temperature, chance of rain and wind.
- **7-day forecast.** Each day's range sits on the week's shared scale, so the days compare at a glance.
- **Units.** °C and km/h, or °F and mph. The app fetches metric and converts locally, so switching is instant and
  costs no request.
- **Saved places.** Star a place to keep it as a chip for this visit. They live in memory only and reset on remount.
- **Loading and failure states.** Skeletons on first load, the previous place dimmed while the next one loads, a
  retry panel if the forecast fails, and an air-quality failure that costs only its own tile.

## Data sources and their terms

| Data                               | Source                                                               | Key   | Terms that shape the code                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------- |
| Forecast, air quality, city search | [Open-Meteo](https://open-meteo.com/)                                | None  | Non-commercial use only, under 10,000 calls a day. CC BY 4.0, so the page footer credits it.                |
| Name of a clicked point            | [Mapbox Geocoding v6](https://docs.mapbox.com/api/search/geocoding/) | Token | Temporary results may not be cached or stored, and may only be used with a Mapbox map.                      |
| Map                                | Mapbox GL JS, through `@repo/ui-vue/map`                             | Token | Each mount is a billed map load (two in dev, under the shell's StrictMode).                                 |
| Chart                              | Highcharts, through `@repo/ui-vue/charts`                            | None  | Free for personal and educational use only: see [chart-core's README](../../packages/chart-core/README.md). |

Commercial use would need a paid Open-Meteo plan and a Highcharts license.

## How it's built

```
src/
  mount.ts      the federation contract; creates the router, Pinia and the QueryClient
  api/          plain fetch functions, mapping API responses to the types in types.ts
  stores/       Pinia: the selected place, the units and the saved places
  hooks/        everything components use: queries, state, geolocation, the colour scheme
  lib/          pure helpers: weather codes, unit conversion and formatting, coordinates
  pages/        the one page and its layout
  components/   they render, and call hooks
```

- **Two kinds of state.** What the APIs return lives in TanStack Query's cache; only client state lives in Pinia.
  Components reach the store through `useWeatherState()`, which gives them a readonly view plus the actions.
- **One Pinia and one `QueryClient` per mount**, never at module scope: the federated module stays cached after
  unmount, so module-level instances would carry state and timers into the next mount. Unmounting also calls
  `queryClient.clear()`.
- **Query keys hold rounded coordinates** (2 decimals, about 1 km, finer than the forecast's grid), so nearby clicks
  reuse the cache. Forecast and air quality go stale after 10 minutes and refresh every 15 while the page is
  visible.
- **Mapbox names are never kept.** `usePlaceName` is the only place they appear: its query has `gcTime: 0` and its
  result never reaches the store. So a saved clicked point keeps only its coordinates, shows them on its chip, and
  gets its name again when selected.
- **`PlaceSearch` is built on `TInput`, not `TCombobox`.** `TCombobox` filters options by their label, which would
  hide valid results: typing "Munchen" finds "Munich".
- **The map and chart engines are lazy-loaded**, each in its own chunk, so the page's first paint doesn't wait for
  them.
- **The layout uses a container query**, not viewport breakpoints, because the shell's sidebar takes part of the
  viewport's width.

Types and theming rules for remotes are in the repo's root `CLAUDE.md` and `documents/`.

## What to plan next

Roughly in the order that would add the most for the least work.

**Features**

- **Remember things between visits:** saved places, the last place and the units in `localStorage`. Saved clicked
  points would need a name the user types, or coordinates, since Mapbox's names can't be stored.
- **Shareable URLs:** put the place in the query string (`?lat=&lng=`), so links and reloads keep it. The router is
  already there.
- **Weather on the map:** a radar or cloud overlay through `TRasterTileLayer`, with a time slider.
- **Weather alerts:** severe-weather warnings for the selected place, using the alarm service. Open-Meteo doesn't
  offer them, so this needs another source.
- **Current temperature on saved chips:** Open-Meteo accepts several coordinates in one request.
- **More detail:** a day view when a row of the 7-day forecast is opened, pollen in Europe, moon phases.
- **Language and locale:** translated labels, locale-aware dates and numbers, and units chosen from the locale.

**Foundations**

- **A small server proxy,** to cache responses across users, hide keys, and stay inside rate limits that currently
  apply to each visitor. It is also where a commercial plan's key would go.
- **Tests:** unit tests for `lib/` and `api/` (weather codes, conversion, response mapping), then end-to-end tests
  for the main flow with the APIs stubbed. The repo has no test setup yet.
- **An async mode for `TCombobox`,** in both libraries, so search can use it instead of its own listbox.
- **A shared `TSkeleton`** in both libraries, replacing this app's `SkeletonBlock`.
- **Sharing Vue with the other remotes** through federation, part of the repo's planned optimization. The map and
  chart chunks are the heaviest part of this app, so sharing those engines would save the most.
- **Error reporting,** so failed requests reach someone besides the viewer.
