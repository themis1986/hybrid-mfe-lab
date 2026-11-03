// The engine's own colours (axes, grid, labels, tooltip, loading) are CSS variables (`--highcharts-*`).
// Its palette injection is turned off (it pins `color-scheme` to the OS, ignoring the page's data-theme),
// and this stylesheet maps every one of them onto the design tokens instead. The tokens are page-level, so
// a light/dark switch restyles the charts with no JavaScript. Injected once, in the `components` layer so
// apps can still override in their own CSS. It stays once added: charts of several bundles share it.
const STYLE_ID = 't-chart-styles'

/** The class on each chart's own container: where the variables apply. */
export const CHART_CLASS = 't-chart'

// The engine derives its neutral and highlight shades by blending the background towards a colour, by
// percentage. The same blend over the tokens; the text shades use the text tokens, so labels keep their
// contrast.
const mix = (token: string, percent: number) =>
  `color-mix(in srgb, var(${token}) ${percent}%, var(--t-color-canvas))`

const SHADES = [3, 5, 10, 20, 40, 60, 80, 100]

const VARIABLES: Record<string, string> = {
  '--highcharts-background-color': 'var(--t-color-canvas)',
  '--highcharts-neutral-color': 'var(--t-color-fg)',
  ...Object.fromEntries(
    SHADES.map((shade) => [
      `--highcharts-neutral-color-${shade}`,
      shade >= 80
        ? 'var(--t-color-fg)'
        : shade === 60
          ? 'var(--t-color-fg-muted)'
          : shade === 20
            ? 'var(--t-color-line)'
            : mix('--t-color-fg', shade),
    ]),
  ),
  '--highcharts-highlight-color': 'var(--t-color-accent)',
  ...Object.fromEntries(
    SHADES.map((shade) => [
      `--highcharts-highlight-color-${shade}`,
      mix('--t-color-accent', shade),
    ]),
  ),
  '--highcharts-positive-color': 'var(--t-color-success)',
  '--highcharts-negative-color': 'var(--t-color-danger)',
  // The engine's default 10 colours, for the few elements that use them directly; series get the
  // `colors` option. The palette has 8: the last two repeat the first two.
  ...Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [
      `--highcharts-color-${index}`,
      `var(--t-color-chart-${(index % 8) + 1})`,
    ]),
  ),
}

const CSS = `@layer components {
.${CHART_CLASS} {
  width: 100%;
  height: 100%;
${Object.entries(VARIABLES)
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}
}
}`

export function ensureChartStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  document.head.appendChild(style)
}
