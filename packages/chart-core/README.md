# Charts: `@repo/chart-core`, `@repo/ui/charts`, `@repo/ui-vue/charts`

Declarative Highcharts charts for both component libraries. The components are the same in React and Vue:

| Component                                | What it does                                                                             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `TChart`                                 | A chart of any supported type (line, area, bar, column, pie, scatter). Fills its parent. |
| `TLineChart` / `TBarChart` / `TPieChart` | `TChart` with its type fixed: the same props, without `type`.                            |

`@repo/chart-core` is the framework-agnostic part both libraries build on:

- the types (`ChartSpec`, `ChartSeries`, the event payloads…);
- `buildOptions(spec)`, a pure function from a spec to engine options;
- `ChartController`, the only code that calls the engine: it creates a chart, applies spec changes in place,
  follows the container's size, shows the loading state and destroys it all;
- the token stylesheet, injected at runtime, and `chartTable(spec)`, the data-table fallback.

It imports no React or Vue. Apps don't import it: the libraries re-export what they need.

The choices behind it are recorded in [documents/decisions/charts.md](../../documents/decisions/charts.md).

## License

**Highcharts is not open source.**

- **Free use:** Personal use (a private individual, non-commercial and non-professional) and Educational use
  (accredited institutions) are free under the Highsoft End-user License Agreement.
- **Commercial use needs a paid license,** per developer seat. Any use in a company counts, including
  prototyping, R&D and internal tools; government and non-profit use count too. The license types:
  - Internal: inside the firewall;
  - SaaS: a public application;
  - OEM: distributed to, or hosted for, customers.
- This repo uses it under the personal, non-commercial terms. **Before an app ships charts in any other
  context, its owner must hold a fitting Highcharts license** (see
  [highcharts.com/license](https://www.highcharts.com/license)).
- There is no license key and nothing to configure in code.

## Usage

Give the chart's parent a height. Series are matched by `id`: a change of `data` goes to that series in place
(`setData`), never through a rebuild. In React, keep data arrays stable (state, memo) so unchanged series skip
the comparison.

### React

```tsx
import {
  type ChartPointEvent,
  type ChartSeries,
  TBarChart,
  TChart,
  type TChartHandle,
  TLineChart,
  TPieChart,
} from '@repo/ui/charts'

const months = ['Jan', 'Feb', 'Mar', 'Apr']
const visits: ChartSeries[] = [
  { id: 'web', name: 'Web', data: [420, 480, 455, 510] },
  {
    id: 'mobile',
    name: 'Mobile',
    data: [300, 340, 390, 410],
    marker: 'square',
  },
]

function Charts() {
  const ref = useRef<TChartHandle>(null) // ref.current?.getChart(): the engine's chart
  const [loading, setLoading] = useState(false)
  const [picked, setPicked] = useState<ChartPointEvent>()

  return (
    <>
      <div className="h-72">
        {/* line, area, column: the same props */}
        <TChart
          ref={ref}
          type="line"
          title="Monthly visits"
          categories={months}
          series={visits}
          yAxis={{ title: 'Visits', min: 0 }}
          valueFormat={(value) => value.toLocaleString('en')}
          loading={loading}
          onPointClick={setPicked}
          onPointHover={(point) => point && console.info(point.value)}
          onSeriesToggle={({ series, visible }) =>
            console.info(series.id, visible)
          }
          onLoad={(chart) => console.info(chart.series.length)}
        />
      </div>
      <div className="h-72">
        <TChart
          type="area"
          stacking="normal"
          title="Visits, stacked"
          categories={months}
          series={visits}
        />
      </div>
      <div className="h-72">
        <TChart
          type="column"
          stacking="percent"
          title="Share per month"
          categories={months}
          series={visits}
        />
      </div>
      <div className="h-72">
        {/* bar: horizontal columns */}
        <TBarChart
          title="Visits by month"
          categories={months}
          series={visits}
          legend="top"
        />
      </div>
      <div className="h-72">
        {/* pie: one series; plain numbers are named after the categories */}
        <TPieChart
          title="Share by region"
          categories={['North', 'South', 'East', 'West']}
          series={[{ id: 'share', name: 'Share', data: [30, 25, 20, 25] }]}
          table="visible"
        />
      </div>
      <div className="h-72">
        {/* scatter: [x, y] points */}
        <TChart
          type="scatter"
          ariaLabel="Height and weight"
          xAxis={{ title: 'Height (cm)' }}
          yAxis={{ title: 'Weight (kg)' }}
          series={[
            {
              id: 'people',
              name: 'People',
              data: [
                [161, 51],
                [167, 59],
                [175, 72],
              ],
            },
          ]}
          tooltip={({ x, value }) => `${x} cm, ${value} kg`}
        />
      </div>
      <TLineChart
        caption="Visits per month."
        categories={months}
        series={visits}
        colors={['chart-3', 'accent']}
      />
    </>
  )
}
```

### Vue

```vue
<script setup lang="ts">
import {
  type ChartPointEvent,
  type ChartSeries,
  TBarChart,
  TChart,
  TPieChart,
} from '@repo/ui-vue/charts'
import { ref, useTemplateRef } from 'vue'

const chart = useTemplateRef<InstanceType<typeof TChart>>('chart') // chart.value?.getChart()
const months = ['Jan', 'Feb', 'Mar', 'Apr']
// Reactive data can be replaced or mutated in place: the chart sees both.
const visits = ref<ChartSeries[]>([
  { id: 'web', name: 'Web', data: [420, 480, 455, 510] },
  { id: 'mobile', name: 'Mobile', data: [300, 340, 390, 410] },
])
const loading = ref(false)
const picked = ref<ChartPointEvent>()
</script>

<template>
  <div class="h-72">
    <TChart
      ref="chart"
      type="line"
      title="Monthly visits"
      :categories="months"
      :series="visits"
      :y-axis="{ title: 'Visits', min: 0 }"
      :value-format="(value: number) => value.toLocaleString('en')"
      :loading="loading"
      @point-click="(point) => (picked = point)"
      @point-hover="(point) => point && console.info(point.value)"
      @series-toggle="({ series, visible }) => console.info(series.id, visible)"
      @load="(engineChart) => console.info(engineChart.series.length)"
    />
  </div>
  <div class="h-72">
    <TChart
      type="column"
      stacking="normal"
      title="Visits, stacked"
      :categories="months"
      :series="visits"
    />
  </div>
  <div class="h-72">
    <TBarChart
      title="Visits by month"
      :categories="months"
      :series="visits"
      legend="top"
    />
  </div>
  <div class="h-72">
    <TPieChart
      title="Share by region"
      :categories="['North', 'South', 'East', 'West']"
      :series="[{ id: 'share', name: 'Share', data: [30, 25, 20, 25] }]"
      table="visible"
    />
  </div>
  <div class="h-72">
    <TChart
      type="scatter"
      aria-label="Height and weight"
      :x-axis="{ title: 'Height (cm)' }"
      :y-axis="{ title: 'Weight (kg)' }"
      :series="[
        {
          id: 'people',
          name: 'People',
          data: [
            [161, 51],
            [167, 59],
            [175, 72],
          ],
        },
      ]"
    />
  </div>
</template>
```

### Same concepts, idiomatic syntax

| React                                 | Vue                                 |
| ------------------------------------- | ----------------------------------- |
| `onPointClick`, `onPointHover`        | `@point-click`, `@point-hover`      |
| `onSeriesToggle`, `onLoad`            | `@series-toggle`, `@load`           |
| `ref` → `TChartHandle` (`getChart()`) | template ref → exposed `getChart()` |
| `className`, `style`                  | `class`, `style` (on the root)      |

The presets take the same props and events. In Vue, use `TChart` when you need the template ref's types.

### Props

| Prop                      | Type                                                          | Notes                                                                                     |
| ------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `type`                    | `'line' \| 'area' \| 'bar' \| 'column' \| 'pie' \| 'scatter'` | Cartesian ↔ cartesian is in place; to or from pie, or bar, re-creates the chart.          |
| `series`                  | `ChartSeries[]`                                               | `{ id, name?, data, type?, color?, visible?, dashStyle?, marker?, stack? }`               |
| `categories`              | `string[]`                                                    | Category labels; a pie's slice names.                                                     |
| `xAxis`, `yAxis`          | `ChartAxis`                                                   | `{ title, min, max, format, type }`. `format` is an engine format string (`'{value} %'`). |
| `title`, `subtitle`       | `string`                                                      | The title also names the chart for screen readers.                                        |
| `caption`                 | `string`                                                      | Visible under the chart, read as its description.                                         |
| `ariaLabel`               | `string`                                                      | The accessible name without a title.                                                      |
| `stacking`                | `'normal' \| 'percent'`                                       |                                                                                           |
| `legend`                  | `boolean \| 'top' \| 'bottom' \| 'right'`                     | Unset: shown for a pie or more than one series.                                           |
| `tooltip`                 | `boolean \| (point) => string`                                | The returned text is engine markup (limited, filtered); escape untrusted names.           |
| `valueFormat`             | `(value: number) => string`                                   | Value axis, default tooltip, data table.                                                  |
| `colors`                  | `ChartColor[]`                                                | Token names (`'chart-1'`…`'chart-8'`, `'accent'`, `'info'`…) or CSS colours.              |
| `loading`, `loadingLabel` | `boolean`, `string`                                           | The engine's loading overlay.                                                             |
| `emptyLabel`              | `string`                                                      | Shown when there is nothing to draw.                                                      |
| `table`                   | `'hidden' \| 'visible' \| 'none'`                             | The data table: screen-reader only (default), shown under the chart, or none.             |
| `options`                 | `ChartOptions`                                                | Raw engine options, deep-merged last (objects merge, arrays replace).                     |

Event payloads are plain values: `ChartPointEvent` is `{ series: { id, name }, index, value, category?, x?,
percentage? }`, and `ChartToggleEvent` is `{ series, name, visible, index? }`.

### States

- **Empty:** no series, or only empty data, shows `emptyLabel` (the engine's no-data module).
- **Loading:** `loading` shows the overlay over the current chart; it stays across updates.
- **Invalid input** shows a message in the chart's place, and no chart is created. That covers an unknown
  type, a series without an id, duplicate ids, non-array data, or more than one pie series.
- **Engine errors** are caught: the message shows in place, the error is logged, and the next different spec
  tries again.
- **Accessibility:** a chart with no title, `ariaLabel` or `caption` logs one warning.

## Theming

Nothing to do: charts follow the page's theme, `data-theme` or the OS scheme, as the switch happens.

- The engine's colours are CSS variables (`--highcharts-*`). chart-core turns off the engine's own palette
  stylesheet and injects one (`<style id="t-chart-styles">`, in `@layer components`) that maps them onto the
  semantic tokens: canvas, fg, fg-muted, line, accent, success, danger.
- Series take `var(--t-color-chart-1…8)` in that order.
- Values stay CSS variables down to the SVG, so a theme switch costs no JavaScript and no chart update.
- **Palette:** `--t-color-chart-1…8` are, in order, iris, orange, cyan, crimson, indigo, jade, plum and grass
  (Radix steps).
  - The order keeps neighbours distinct for colour-blind readers, and every colour clears 3:1 on the canvas,
    in both schemes.
  - Status hues are left out on purpose.
  - Past eight series the colours repeat: fold the rest into "Other" or split the chart.
- **Overrides:**
  - `colors` takes token names or any CSS colour;
  - a series takes its own `color`;
  - an app can re-map any `--highcharts-*` variable on `.t-chart` in its own CSS.
- Colour isn't the only cue: lines cycle marker shapes, the legend appears from two series, and the data
  table is always there for screen readers.

## Modules

| Loaded by default                           | Opt in, from the app                                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| core, `accessibility`, `no-data-to-display` | `import 'highcharts/es-modules/masters/modules/<name>.src.js'` (e.g. `boost`, `exporting`, `export-data`) |

- Import opt-in modules **from `highcharts/es-modules/masters/`**, before the first chart renders. Modules
  register on the engine they import, so another build (`highcharts/esm/…`, the UMD `highcharts/modules/…`)
  would land on a second engine.
- Opt-in modules need `highcharts` as a dependency of the app, at the catalog version.
- Chart types from `highcharts-more` (spline is in core; area range, bubble…) work through `options` once
  the module is imported. The spec types only cover the six listed types.

**Large data:**

- Plain charts are fine up to a few thousand points.
- A series over 5 000 points logs a warning unless the boost module is loaded. Import
  `highcharts/es-modules/masters/modules/boost.src.js` in the app: it switches to WebGL from 5 000 points per
  series.
- Boost needs array data (`[x, y]` or numbers), not objects.

## Lifecycle

- **One controller per mounted chart.** It renders into an element of its own inside the component, so the
  framework never touches engine DOM. Under React StrictMode the effect runs twice; the first chart is fully
  destroyed.
- **Updates** are diffed. Non-series options go through one `chart.update`; series are matched by id
  (`setData`, `series.update`, `addSeries`, `remove`); one redraw. An equal spec makes no engine call. New
  formatter or handler functions alone make no engine call either: they are read when the engine calls them.
- **Re-created** only between the pie, bar and other families, or when `colors` changes.
- **Resize:** a `ResizeObserver` on the container calls `reflow()`. The engine's own observer is off, because
  it is never disconnected.
- **Reduced motion:** `prefers-reduced-motion: reduce` turns animation off.
- **Destroy** is idempotent and removes the chart, its element and the observer; later calls are no-ops.

## Adding a chart type

1. Add the name to `ChartType` in `src/types.ts` and to the set in `src/validate.ts`.
2. If it needs a module (`highcharts-more`, `heatmap`…), decide:
   - default: import it in `src/engine.ts`; it grows every chart's bundle;
   - opt-in: document the import here.
3. In `src/options.ts`:
   - map any data shape it needs, as `pieData` does;
   - add its plot options (keep colours as token variables).
4. If it can't morph into the existing types in place, give it its own family in `ChartController.ts`
   (`family()`).
5. If its data isn't category- or point-shaped, teach `chartTable()` its rows.
6. Rebuild, and run the fake-engine check (see the decision record).
   - Nothing changes in the framework components: they pass the spec through.
   - Add the name to the docs catalogs' `type` row.

## Limits

- Six chart types through the spec; anything else goes through `options` and the escape hatch
  (`getChart()`).
- No export UI, drilldown, stock/maps/gantt charts, or data fetching.
- The engine is bundled per remote (`shared: {}`), in the chunk that shows a chart.
- Specs are compared as JSON on every change: for very large data, keep array identities stable (React), or
  load boost.
- Functions inside `options` aren't diffed: change something else, or the key, to apply new ones.
