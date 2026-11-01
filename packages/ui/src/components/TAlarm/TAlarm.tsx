import type { TAlarmProps } from './types'
import { useAlarmItem } from './useAlarmItem'

// The declarative form of alarm.*(): while `open`, the alarm is in the page's alarm store, and the page's
// TAlarmHost renders it (this component renders nothing itself). When it closes on its own, onOpenChange
// gets false; setting `open` to false takes it away.
export function TAlarm({ open, onOpenChange, onAction, variant = 'info', ...fields }: TAlarmProps) {
  useAlarmItem(open, { variant, ...fields }, { onClose: () => onOpenChange?.(false), onAction })
  return null
}
