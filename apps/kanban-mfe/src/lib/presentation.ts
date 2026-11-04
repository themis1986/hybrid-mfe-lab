import {
  ChevronDown,
  ChevronsUp,
  ChevronUp,
  Equal,
  type LucideIcon,
} from '@repo/ui/icons'
import type { LabelTone, Priority } from '../types'

// How the board's values look. Tones use the status and accent token families, whose -subtle, -line and
// -fg steps are made to work together, so no contrast is decided here.
export const LABEL_TONE_CLASSES: Record<LabelTone, string> = {
  neutral: 'border-line bg-surface text-fg-muted',
  accent: 'border-accent-line bg-accent-subtle text-accent-fg',
  info: 'border-info-line bg-info-subtle text-info-fg',
  success: 'border-success-line bg-success-subtle text-success-fg',
  warning: 'border-warning-line bg-warning-subtle text-warning-fg',
  danger: 'border-danger-line bg-danger-subtle text-danger-fg',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  none: 'No priority',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const PRIORITY_DISPLAY: Record<
  Exclude<Priority, 'none'>,
  { icon: LucideIcon; className: string }
> = {
  urgent: { icon: ChevronsUp, className: 'text-danger-fg' },
  high: { icon: ChevronUp, className: 'text-warning-fg' },
  medium: { icon: Equal, className: 'text-info-fg' },
  low: { icon: ChevronDown, className: 'text-fg-muted' },
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
