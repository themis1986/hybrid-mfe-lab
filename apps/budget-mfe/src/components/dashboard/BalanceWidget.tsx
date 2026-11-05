import { TWidget } from '@repo/ui'
import { TChart } from '@repo/ui/charts'
import { useSummary } from '../../hooks/useSummary'
import { formatAxisMoney, moneyTooltip } from './charts'

/** The balance at the end of each day or month: everything before the period plus its running total. */
export function BalanceWidget() {
  const { balanceChart } = useSummary()
  return (
    <TWidget title="Balance" headingLevel={2} className="min-w-0">
      <div className="h-64">
        <TChart
          type="area"
          categories={balanceChart.categories}
          series={balanceChart.series}
          valueFormat={formatAxisMoney}
          tooltip={moneyTooltip}
          ariaLabel="Balance over the period"
        />
      </div>
    </TWidget>
  )
}
