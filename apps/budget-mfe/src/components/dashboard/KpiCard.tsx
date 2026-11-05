import { TBadge, TCard, TIcon } from '@repo/ui'
import {
  type LucideIcon,
  Minus,
  Percent,
  Scale,
  TrendingDown,
  TrendingUp,
} from '@repo/ui/icons'
import { formatPercent, formatSignedPercent, formatSignedPoints } from '../../lib/format'
import { formatMoney, formatSignedMoney } from '../../lib/money'
import type { Kpi, KpiId } from '../../lib/summary'
import { Sparkline } from './Sparkline'

const ICONS: Record<KpiId, LucideIcon> = {
  balance: Scale,
  income: TrendingUp,
  expenses: TrendingDown,
  savings: Percent,
}

const TREND_LABELS: Record<KpiId, string> = {
  balance: 'Balance over the period',
  income: 'Income over the period',
  expenses: 'Expenses over the period',
  savings: 'Savings rate over the period',
}

function formatValue(kpi: Kpi): string {
  if (kpi.value === null) return '—'
  return kpi.kind === 'money' ? formatMoney(kpi.value) : formatPercent(kpi.value)
}

function formatDelta(kpi: Kpi, delta: number): string {
  if (kpi.deltaKind === 'money') return formatSignedMoney(delta)
  if (kpi.deltaKind === 'points') return formatSignedPoints(delta)
  return formatSignedPercent(delta)
}

/** The change, coloured by whether it is good news, with an arrow and words: never colour alone. */
function Delta({ kpi }: { kpi: Kpi }) {
  const { delta } = kpi
  if (delta === null) {
    return <p className="m-0 text-xs text-fg-muted">Nothing to compare with yet</p>
  }
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  const tone =
    direction === 'flat'
      ? 'neutral'
      : (direction === 'up') === kpi.upIsGood
        ? 'success'
        : 'danger'
  const icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus

  return (
    <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted">
      <TBadge tone={tone}>
        <TIcon icon={icon} size="sm" />
        {formatDelta(kpi, delta)}
      </TBadge>
      {kpi.id === 'balance' ? 'this period' : 'vs the previous period'}
    </p>
  )
}

/** One headline number: label, value, its change, and its trend over the period. */
export function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <TCard variant="elevated" className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-medium text-fg-muted">{kpi.label}</h3>
        <TIcon icon={ICONS[kpi.id]} size="sm" className="text-fg-muted" />
      </div>
      <p className="m-0 text-2xl leading-tight font-semibold text-fg tabular-nums">
        {formatValue(kpi)}
      </p>
      <Delta kpi={kpi} />
      <Sparkline id={kpi.id} trend={kpi.trend} label={TREND_LABELS[kpi.id]} />
    </TCard>
  )
}
