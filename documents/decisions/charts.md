# Decision record: charts

Status: accepted, 2026-11-03. Research done on that date against npm, the official documentation and the
engine's source (Highcharts 13.1.1).

Both component libraries gained a declarative chart: line, area, bar, column, pie and scatter, with
stacking, loading and empty states, click/hover/legend events and a data-table fallback. This record explains
the choices. How to use the components is in
[packages/chart-core/README.md](../../packages/chart-core/README.md).

## Shape

```
packages/chart-core   @repo/chart-core     framework-agnostic: types, the spec → options builder, the
                                           controller that owns a chart, the token stylesheet, the data table
packages/ui           @repo/ui/charts      the React components, on chart-core
packages/ui-vue       @repo/ui-vue/charts  the Vue components, on chart-core
```

- The components live in a separate `./charts` entry, like `./icons` and `./map`. Apps that show no chart
  never bundle the engine (about 420 kB minified, 145 kB gzipped with the default modules).
- chart-core holds every engine call. The framework components only turn props into a spec and hand it to
  the controller, so both frameworks share one implementation and the same behaviour.

## 1. The engine and its license: Highcharts 13.1

The engine was fixed by the brief.

- **Version:** 13.1.1 (`^13.1.1` in the catalog), published 2026-09-20. Types ship with the package. Optional
  peers (`jspdf`, `svg2pdf.js`, for PDF export) are not installed. There are no install scripts.
- **License: not open source.** The npm license field is a URL. The terms read on 2026-11-03 were the
  Standard License Agreement 19.1 and the End-user License Agreement 1.0:
  - Free use covers **Personal use** only (a private individual, non-commercial and non-professional) and
    **Educational use** (accredited institutions, coursework, non-funded research).
  - **Any use in a company is commercial,** including prototyping, R&D, internal tools and presentations.
    Government and non-profit use is commercial too.
  - Commercial use needs a paid license, counted per developer seat:
    - Internal: inside the firewall;
    - SaaS: one public application;
    - OEM: distributed to, or hosted for, customers.
  - Contractors are covered by their client's license.
  - There is no license key and no activation, and no credit link is required. The free CDN is limited to
    personal and educational use, and this repo doesn't use it anyway.
- **This repo uses it under the personal, non-commercial terms,** as its owner decided. **An app owner must
  hold a Highcharts license before any commercial use, and must check that:**
  - the license type fits the deployment (internal, public SaaS, or OEM);
  - every developer working with the code is counted.
    Choosing Highcharts is a licensing decision, not only a technical one.

## 2. Wrappers: thin custom ones in both frameworks

| Official wrapper                            | Why not                                                                                                                                                                                                                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@highcharts/react` 5.4 (React ≥ 18, HC 13) | No longer MIT: an "Official Integration License", valid only alongside a licensed Highcharts. On every change it calls `chart.update(options, true, true)` (one-to-one) instead of targeted per-series updates. Its JSX children model and on-demand module loader are React-only. |
| `highcharts-react-official` 3.2 (MIT)       | The legacy wrapper: an options object plus `chart.update`; nothing to share with Vue.                                                                                                                                                                                              |
| `highcharts-vue` 2.0 (Vue 3)                | Highsoft license (not MIT). Same whole-options update model; Vue-only.                                                                                                                                                                                                             |

- A thin wrapper per framework over one shared controller gives:
  - one diffing and lifecycle implementation for both frameworks;
  - full control over teardown (StrictMode, a federated remote unmounted by its host);
  - no extra dependency or license.
- The cost: chart-core is about 950 lines, half of them types and comments; each framework adds about 270.

## 3. Module loading

- **Import path:** the pure-ESM build, `highcharts/es-modules/masters/highcharts.src.js`, and
  `…/es-modules/masters/modules/<name>.src.js`.
  - The webpack-bundled `highcharts/esm/…` files are the older route.
  - The package has no `exports` map, so these deep paths are its public API.
- **Registration:** since v12 a module registers itself when imported. It imports the core's globals and
  composes onto them, so there is no factory call.
  - The consequence: **core and modules must come from one module graph**, or the modules land on a second
    engine and silently do nothing.
  - chart-core's build therefore keeps every `highcharts` import external (`/^highcharts($|\/)/`, not only the
    bare name), and each app resolves them once.
- **Tree-shaking:** the core is one module that registers every core series type; it doesn't tree-shake.
  Modules are opt-in files.
- **Default set:** the core, `accessibility` (keyboard navigation, screen-reader descriptions and proxies) and
  `no-data-to-display` (the empty message).
- **More modules** (boost, exporting, more, …) are imported by the app itself, from the same
  `es-modules/masters` path, before its first chart renders. The default bundle stays as it is.
- **Vite:** Highcharts' docs warn that Vite ≤ 7's esbuild pre-bundling breaks the module order in dev.
  Vite 8 (Rolldown) was checked in dev: the accessibility module registers, so no `optimizeDeps.exclude` is
  needed.

## 4. Theming with the design tokens

Highcharts 13 draws with CSS variables by default:

- its default options use `var(--highcharts-color-N)`, `var(--highcharts-neutral-color-N)`,
  `var(--highcharts-background-color)` and similar;
- it injects a "palette" stylesheet defining them.

Three options were compared:

| Option                                     | Verdict                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Styled mode + the engine's CSS file        | A 30 kB stylesheet to inject, colours only through classes (per-series colours need extra CSS), and it follows `prefers-color-scheme` unless a class is set on each chart.                                                                                                                                                                                                      |
| Resolve tokens with `getComputedStyle`     | Works, but every theme switch needs a watcher (`data-theme` mutation + media query) and a `chart.update` per chart.                                                                                                                                                                                                                                                             |
| **Token-mapped engine variables (chosen)** | Turn the engine's palette injection off (`palette.injectCSS: false`) and inject one small stylesheet that maps every `--highcharts-*` variable onto the semantic tokens. Series colours are `var(--t-color-chart-N)` strings. The values stay CSS variables all the way into the SVG, so a theme switch recolours every chart with no JavaScript, no update and no re-creation. |

- **Why the engine's own palette CSS is off:** it ends with `.highcharts-container { color-scheme: light dark }`,
  which follows the OS and ignores `data-theme`. Our tokens compile `light-dark()` into page-level variables
  instead (see CLAUDE.md), so the mapping inherits the page's scheme.
- **The mapping:**
  - the background is the canvas token;
  - text shades use the text tokens (fg, fg-muted);
  - the grid uses the line token;
  - the other neutral and highlight shades are `color-mix()` blends of fg/accent into canvas. That is the same
    interpolation the engine does itself.
- The stylesheet sits in `@layer components`, scoped to a class on each chart's own element. It is injected
  once and never removed, because charts of several bundles share it.
- **Parseable colours aren't needed:** where the engine computes a colour (hover brightening, opacity), v13
  falls back to `color-mix()` when it can't parse the input, so `var()` values keep working.
- **Proven:**
  - light, dark, and a live `data-theme` toggle;
  - the OS scheme when no `data-theme` is set;
  - the computed fills of labels, grid lines and bars changed while the chart elements stayed the same;
  - no engine update was counted;
  - checked in headless Chrome in both docs apps, with screenshots.
- **Cost:** about 2 kB of injected CSS and zero runtime work per theme switch. Colours inside raw escape-hatch
  options must also be CSS colours or variables.

### The categorical palette

- Eight semantic tokens, `--t-color-chart-1…8`, take Radix steps from iris (the accent), orange, cyan, crimson,
  indigo, jade, plum and grass. Each new hue adds only the steps used.
- The status hues (red, green, blue, amber) are left out: their colours already mean something.
- The order and steps were chosen by enumerating candidates against a palette validator:
  - every colour clears 3:1 on the canvas in both schemes;
  - every neighbouring pair stays distinct under protan/deutan simulation (ΔE ≥ 11) and normal vision
    (ΔE ≥ 25);
  - the first three are also distinct from each other.
- Orange needs step 10 in light and step 8 in dark: `light-dark(var(--t-orange-10), var(--t-orange-8))`.
- Colour is never the only cue:
  - lines keep the engine's cycling marker shapes;
  - a legend appears from two series;
  - every chart carries a data table.

## 5. Lifecycle and updates

- **Create:**
  - one chart per controller, rendered into an element the controller creates inside the framework's
    container, so neither framework ever holds engine DOM;
  - the stylesheet is ensured first.
- **Update:**
  - the spec is rebuilt into options and diffed against the last ones (JSON; identity first for data
    arrays);
  - non-series options go through one `chart.update(…, false)`;
  - series are matched by id: `setData` for data, `series.update` for the rest, `addSeries` / `remove` for ids
    that come and go;
  - one `redraw()` at the end, and nothing at all when nothing changed.
  - The chart is re-created only on a structural change:
    - between the pie, bar (inverted) and other cartesian families;
    - or new colours, because series take theirs when created.
  - Formatters and event handlers are stable wrappers that read the latest spec and callbacks, so a new
    function from a re-render costs no engine call.
- **Animation:** updates animate by default (point transitions after `setData`). With
  `prefers-reduced-motion: reduce`, both the chart and the series animation are off. Highcharts doesn't
  honour that preference itself.
- **Data mutation:** the engine is told not to mutate the data it is given (`chart.allowMutatingData: false`),
  because the arrays are React props or Vue state.
- **Resize:** the engine's own reflow is off. It starts a `ResizeObserver` on its container and never
  disconnects it. The controller observes the container itself, calls `reflow()`, and disconnects on
  destroy.
- **Loading:** `showLoading(label)` and `hideLoading()`. The state is idempotent and survives a re-creation.
- **Destroy:**
  - stops observing, destroys the chart and removes its element;
  - it is idempotent, and every later call is a no-op.
  - Nothing in the controller is asynchronous, so there is no request to cancel. An app that fetches data
    and updates after unmount reaches a destroyed controller and does nothing.
- **Errors:**
  - an invalid spec is reported in place by validation, and no chart is created;
  - an engine exception during create or update is caught and logged, and the chart is re-created from the
    spec;
  - the error is exposed for the component to show, and a failing spec isn't retried until it changes.
- **StrictMode / remounts:**
  - React's double-invoked effects create, destroy, then create again, with nothing left behind;
  - a remote mounted and unmounted repeatedly leaves no chart, container or stylesheet duplicate.
  - Both were verified by counting the engine's chart elements (each carries the engine's chart index).

## 6. Events and accessibility

- **Events:**
  - the engine's point `click` and `mouseOver`, the series `mouseOut` and `legendItemClick` (on series, and on
    points for a pie) and the chart `load` are bound once;
  - they are turned into plain payloads: series id and name, point index, value, category, x, percentage;
  - the components expose them without engine types. The engine's chart stays reachable as the escape hatch.
- **Accessibility module:**
  - keyboard navigation through series and points, an ARIA region with a label, screen-reader descriptions,
    and proxy buttons for legend items;
  - the label comes from the title, or from an explicit accessible name;
  - a caption is visible and is read as the chart's description.
  - A chart without any of the three warns once.
- **Data table fallback:**
  - Highcharts' own "view data table" needs the export-data module (and exporting).
  - Instead, chart-core turns the spec into rows and columns (by category, per point when points carry their
    own x, or per slice), and the components render a real `<table>`.
  - It is visually hidden by default (still read by screen readers), can be shown, or left out.

## 7. Data volume

- Plain SVG charts stay responsive up to a few thousand points per chart.
- The boost module (WebGL) kicks in by default at 5 000 points per series, or 50 series per chart. Its limits:
  - array data only;
  - areas drawn as 1 px columns;
  - no per-point styling.
- The libraries don't load boost. A series over 5 000 points without boost registered logs one warning,
  pointing to the module path. An app with large data imports boost itself.
- Object-form points above the engine's turbo threshold (1 000) must become arrays; the engine reports it.

## Trade-offs accepted

- The engine is bundled per remote, like the frameworks (`shared: {}`), and only in the chunk that shows a
  chart.
- Specs are compared as JSON on every change. Large data should keep its array identity between renders
  (React) so the comparison short-cuts. Vue specs copy the data arrays, so in-place mutations are seen.
- Functions inside the raw options escape hatch aren't diffed.
- A pie and a cartesian chart can't morph into each other in place: switching re-creates the chart.
- The data table and the engine's screen-reader section both describe the chart. Hide the table where that
  duplication matters.

## Next steps

- Boost wiring for large data (an opt-in prop that imports the module lazily).
- More chart types (spline, area range, heatmap, treemap), each with its module where needed.
- Export (exporting + export-data) behind an opt-in.
- Sharing the engine (and the frameworks) across remotes through federation `shared`.
- Out of scope so far: stock, maps and gantt charts, drilldown, dashboards, data fetching, server rendering.
