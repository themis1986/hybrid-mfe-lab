import { type ChartOptions, TChart } from '@repo/ui/charts'
import { useMemo } from 'react'
import { sparklineSeries } from '../../lib/charts'

// A trend line in a stat tile: no axes, legend, tooltip or keyboard stop. It is decorative: the tile
// states the value and its change in words, so the chart is hidden from assistive technology. Filled down to
// the lowest value, not to zero, so a small change over a large balance still shows.
const OPTIONS: ChartOptions = {
  chart: { spacing: [2, 0, 2, 0] },
  xAxis: { visible: false },
  yAxis: { visible: false, startOnTick: false, endOnTick: false },
  plotOptions: {
    series: {
      enableMouseTracking: false,
      lineWidth: 2,
      states: { hover: { enabled: false } },
    },
    area: { threshold: null, fillOpacity: 0.12 },
  },
  accessibility: { enabled: false },
}

export function Sparkline({
  id,
  trend,
  label,
}: {
  id: string
  trend: (number | null)[]
  label: string
}) {
  const series = useMemo(() => sparklineSeries(id, trend), [id, trend])
  return (
    <div aria-hidden className="h-12">
      <TChart
        type="area"
        series={series}
        options={OPTIONS}
        legend={false}
        tooltip={false}
        table="none"
        ariaLabel={label}
      />
    </div>
  )
}
