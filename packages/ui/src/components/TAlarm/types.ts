import type { TAlarmPosition, TAlarmVariant } from '../../lib/alarm'

export type { TAlarmOptions, TAlarmPosition, TAlarmVariant } from '../../lib/alarm'

export interface TAlarmHostProps {
  /** Where alarms appear unless one asks for another position. */
  position?: TAlarmPosition
  /** Default milliseconds before an alarm closes on its own. */
  duration?: number
  /** Names the alarm region for assistive technology; F8 moves focus to it. */
  label?: string
}

export interface TAlarmProps {
  /** Shows the alarm while true. Pair it with onOpenChange: the alarm closes itself (timeout, dismiss, swipe). */
  open: boolean
  onOpenChange?: (open: boolean) => void
  variant?: TAlarmVariant
  /** The message. */
  title: string
  /** A second, quieter line. */
  description?: string
  /** The host's position when omitted. */
  position?: TAlarmPosition
  /** Milliseconds before it closes; Infinity keeps it open. The host's when omitted. */
  duration?: number
}
