import { TWidget } from '@repo/ui'
import { TChart } from '@repo/ui/charts'
import { useSummary } from '../../hooks/useSummary'
import { COLUMN_OPTIONS, formatAxisMoney, moneyTooltip } from './charts'

/** Income and expenses side by side, per day or per month of the period. One axis, one unit. */
export function CashflowWidget() {
  const { cashflowChart } = useSummary()
  return (
    <TWidget title="Income and expenses" headingLevel={2} className="min-w-0">
      <div className="h-72">
        <TChart
          type="column"
          categories={cashflowChart.categories}
          series={cashflowChart.series}
          valueFormat={formatAxisMoney}
          tooltip={moneyTooltip}
          legend="top"
          options={COLUMN_OPTIONS}
          emptyLabel="No transactions in this period"
          ariaLabel="Income and expenses over the period"
        />
      </div>
    </TWidget>
  )
}
