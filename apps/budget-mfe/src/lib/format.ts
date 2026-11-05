// Numbers as the dashboard writes them, in the browser's locale.

const PERCENT = new Intl.NumberFormat(undefined, {
  style: 'percent',
  maximumFractionDigits: 0,
})
const SIGNED_PERCENT = new Intl.NumberFormat(undefined, {
  style: 'percent',
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
})
const SIGNED_POINTS = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
})

/** 0.24 → "24%" */
export function formatPercent(ratio: number): string {
  return PERCENT.format(ratio)
}

/** 0.124 → "+12.4%" */
export function formatSignedPercent(ratio: number): string {
  return SIGNED_PERCENT.format(ratio)
}

/** A change between two rates, in percentage points: 0.031 → "+3.1 pts" */
export function formatSignedPoints(delta: number): string {
  return `${SIGNED_POINTS.format(delta * 100)} pts`
}
