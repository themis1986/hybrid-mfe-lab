import { TButton, TCluster, TGrid, TStack } from '@repo/ui'
import {
  type ChartPointEvent,
  TChart,
  type TChartHandle,
  TPieChart,
} from '@repo/ui/charts'
import { useEffect, useRef, useState } from 'react'
import { months, regions, sales, share, traffic } from './chartData'

type Stacking = 'normal' | 'percent' | 'off'

const stackings: Stacking[] = ['normal', 'percent', 'off']
const visits = (value: number) => value.toLocaleString('en')
const describe = (event: ChartPointEvent) =>
  `${event.series.name} · ${event.category}: ${event.value}`

// The chart demo: loaded on its own (React.lazy), so the chart engine downloads only with it. Every button
// changes props of the same three charts: the "created" count only moves when a chart is re-created.
export default function ChartDemo() {
  const lineChart = useRef<TChartHandle>(null)
  const [visitsData, setVisitsData] = useState(traffic)
  const [salesData, setSalesData] = useState(sales)
  const [shareData, setShareData] = useState(share)
  const [area, setArea] = useState(false)
  const [stacking, setStacking] = useState<Stacking>('normal')
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [live, setLive] = useState(false)
  const [picked, setPicked] = useState('Click a point, a bar or a slice.')
  const [created, setCreated] = useState(0)

  const refresh = () => {
    setVisitsData(traffic())
    setSalesData(sales())
    setShareData(share())
  }

  useEffect(() => {
    if (!live) return
    const timer = setInterval(refresh, 2000)
    return () => clearInterval(timer)
  }, [live])

  const onLoad = () => setCreated((count) => count + 1)
  const onPointClick = (event: ChartPointEvent) => setPicked(describe(event))

  return (
    <TStack gap={3}>
      <TCluster gap={2}>
        <TButton size="sm" variant="outline" onClick={refresh}>
          Update data
        </TButton>
        <TButton
          size="sm"
          variant={live ? 'soft' : 'outline'}
          aria-pressed={live}
          onClick={() => setLive(!live)}
        >
          Every 2 s
        </TButton>
        <TButton
          size="sm"
          variant={area ? 'soft' : 'outline'}
          aria-pressed={area}
          onClick={() => setArea(!area)}
        >
          Area
        </TButton>
        <TButton
          size="sm"
          variant="outline"
          onClick={() =>
            setStacking(
              stackings[(stackings.indexOf(stacking) + 1) % stackings.length],
            )
          }
        >
          Stacking: {stacking}
        </TButton>
        <TButton
          size="sm"
          variant={loading ? 'soft' : 'outline'}
          aria-pressed={loading}
          onClick={() => setLoading(!loading)}
        >
          Loading
        </TButton>
        <TButton
          size="sm"
          variant={empty ? 'soft' : 'outline'}
          aria-pressed={empty}
          onClick={() => setEmpty(!empty)}
        >
          Empty sales
        </TButton>
        <TButton
          size="sm"
          variant="ghost"
          // The escape hatch: the engine's chart.
          onClick={() =>
            console.info(lineChart.current?.getChart()?.series.length)
          }
        >
          Log series count
        </TButton>
      </TCluster>

      <TGrid minChildWidth="18rem" gap={4}>
        <div className="h-72">
          <TChart
            ref={lineChart}
            type={area ? 'area' : 'line'}
            title="Monthly visits"
            categories={months}
            series={visitsData}
            valueFormat={visits}
            loading={loading}
            onPointClick={onPointClick}
            onLoad={onLoad}
          />
        </div>
        <div className="h-72">
          <TChart
            type="column"
            title="Sales by region"
            caption="Units sold per product line."
            categories={regions}
            series={
              empty
                ? salesData.map((series) => ({ ...series, data: [] }))
                : salesData
            }
            stacking={stacking === 'off' ? undefined : stacking}
            emptyLabel="No sales yet"
            loading={loading}
            onPointClick={onPointClick}
            onLoad={onLoad}
          />
        </div>
        <div className="h-72">
          <TPieChart
            title="Share by region"
            categories={regions}
            series={shareData}
            loading={loading}
            onPointClick={onPointClick}
            onLoad={onLoad}
          />
        </div>
      </TGrid>

      <p className="m-0 text-sm text-fg-muted" aria-live="polite">
        {picked} · Charts created: {created}. Switch the page theme: the charts
        follow it without being re-created.
      </p>
    </TStack>
  )
}
